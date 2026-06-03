import { Buffer } from 'node:buffer'
import {
  type Attachment,
  type ListAttachmentsResponseSuccess,
  Resend,
} from 'resend'
import {
  type AppEnv,
  envSchema,
  receivedEmailEventSchema,
  resendEventSchema,
  resendHeadersSchema,
} from './types'

const INBOUND_WEBHOOK_PATH = '/api/webhook/inbound'

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...init?.headers,
    },
  })
}

function getResendHeaders(request: Request) {
  return resendHeadersSchema.safeParse({
    id: request.headers.get('svix-id'),
    timestamp: request.headers.get('svix-timestamp'),
    signature: request.headers.get('svix-signature'),
  })
}

async function getAttachments(
  resend: Resend,
  emailId: string,
): Promise<Attachment[] | undefined> {
  const { data, error } = await resend.emails.receiving.attachments.list({
    emailId,
  })

  if (error) {
    throw new Error(`Failed to fetch attachments: ${error.message}`)
  }

  const attachments = data?.data as ListAttachmentsResponseSuccess['data']

  if (!attachments?.length) {
    return undefined
  }

  const forwardedAttachments: Attachment[] = []

  for (const attachment of attachments) {
    const response = await fetch(attachment.download_url)

    if (!response.ok) {
      throw new Error(
        `Failed to download attachment ${attachment.filename}: ${response.status}`,
      )
    }

    forwardedAttachments.push({
      content: Buffer.from(await response.arrayBuffer()).toString('base64'),
      contentId: attachment.content_id,
      contentType: attachment.content_type,
      filename: attachment.filename,
    })
  }

  return forwardedAttachments
}

async function forwardEmail(env: AppEnv, event: unknown) {
  const baseEvent = resendEventSchema.parse(event)

  if (baseEvent.type !== 'email.received') {
    return json({ message: 'Event ignored' })
  }

  const parsedEvent = receivedEmailEventSchema.parse(baseEvent)
  const resend = new Resend(env.RESEND_API_KEY)
  const { email_id: emailId, subject } = parsedEvent.data

  const { data: email, error: emailError } =
    await resend.emails.receiving.get(emailId)

  if (emailError) {
    throw new Error(`Failed to fetch email: ${emailError.message}`)
  }

  const attachments = await getAttachments(resend, emailId)
  const content = email?.html
    ? {
        html: email.html,
        ...(email.text ? { text: email.text } : {}),
      }
    : {
        text: email?.text ?? '',
      }

  const { data, error: sendError } = await resend.emails.send({
    from: env.FORWARD_FROM,
    to: [env.FORWARD_TO],
    subject: subject ?? '(no subject)',
    ...content,
    attachments,
  })

  if (sendError) {
    throw new Error(`Failed to forward email: ${sendError.message}`)
  }

  return json({ message: 'Email forwarded successfully', data })
}

export default {
  async fetch(request, rawEnv): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname !== INBOUND_WEBHOOK_PATH) {
      return new Response('Not Found', { status: 404 })
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: {
          allow: 'POST',
        },
      })
    }

    const env = envSchema.safeParse(rawEnv)

    if (!env.success) {
      console.error('Invalid Worker environment', env.error.flatten())
      return json(
        { message: 'Worker environment is not configured' },
        {
          status: 500,
        },
      )
    }

    const headers = getResendHeaders(request)

    if (!headers.success) {
      return json(
        { message: 'Missing or invalid Resend webhook headers' },
        {
          status: 400,
        },
      )
    }

    try {
      const payload = await request.text()
      const resend = new Resend(env.data.RESEND_API_KEY)
      let event: unknown

      try {
        event = resend.webhooks.verify({
          payload,
          headers: headers.data,
          webhookSecret: env.data.RESEND_WEBHOOK_SECRET,
        })
      } catch (error) {
        console.error('Invalid Resend webhook signature', error)
        return json(
          { message: 'Invalid Resend webhook signature' },
          { status: 400 },
        )
      }

      return await forwardEmail(env.data, event)
    } catch (error) {
      console.error(error)
      return json(
        { message: 'Failed to process inbound email' },
        { status: 500 },
      )
    }
  },
} satisfies ExportedHandler<Env>
