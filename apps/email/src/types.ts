import { z } from 'zod'

export const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_WEBHOOK_SECRET: z.string().min(1),
  FORWARD_FROM: z.email(),
  FORWARD_TO: z.email(),
})

export type AppEnv = z.infer<typeof envSchema>

export const resendHeadersSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().min(1),
  signature: z.string().min(1),
})

export const resendEventSchema = z.object({
  type: z.string(),
  data: z.unknown(),
})

export const receivedEmailEventSchema = z.object({
  type: z.literal('email.received'),
  data: z.object({
    email_id: z.string().min(1),
    subject: z.string().optional(),
  }),
})

export type ResendEvent = z.infer<typeof resendEventSchema>
