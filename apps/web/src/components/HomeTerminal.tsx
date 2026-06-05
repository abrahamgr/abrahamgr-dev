import { TerminalWindow } from './TerminalWindow'

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void
    }
  }
}

type SnapshotRow = {
  label: string
  value: string
}

type TerminalLink = {
  label: string
  href: string
}

const profile = {
  title: 'abraham@portfolio: ~/modern-stack',
  command: './load-modern-engineering-profile.sh',
  name: 'Abraham Galindo',
  description:
    'Staff Software Engineer focused on React, Next.js, Node.js, TypeScript, micro-frontends, frontend architecture, and high-quality product delivery.',
  statusLines: [
    '[ok] loading 10+ years of engineering experience',
    '[ok] focusing React, Next.js, Node.js, TypeScript',
    '[ok] improving web performance, design systems',
    '[ok] enabling technical leadership, mentoring, code quality',
  ],
  snapshotCommand: 'whoami',
  snapshotRows: [
    {
      label: 'role      :',
      value: 'staff_software_engineer | tech_lead',
    },
    {
      label: 'builds    :',
      value: 'react | nextjs | nodejs | micro_frontends',
    },
    {
      label: 'approach  :',
      value: 'performance | design_systems | scalable_delivery',
    },
  ],
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/abrahamgr',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/abrahamgr28',
    },
    {
      label: 'Email',
      href: 'mailto:contact@abrahamgr.dev',
    },
    {
      label: 'Credly',
      href: 'https://www.credly.com/users/abrahamgr/badges',
    },
  ],
}

function CommandLine({ children }: { children: string }) {
  return <p className="m-0 text-sm text-neon-command">$ {children}</p>
}

function StatusOutput({ lines }: { lines: string[] }) {
  return (
    <div className="grid gap-1.25 text-xs text-neon-status">
      {lines.map((line) => (
        <p className="m-0" key={line}>
          {line}
        </p>
      ))}
    </div>
  )
}

function SnapshotRows({ rows }: { rows: SnapshotRow[] }) {
  return (
    <dl className="m-0 grid gap-1" aria-label="Engineering snapshot">
      {rows.map((row) => (
        <div
          className="grid gap-0.5 text-xs min-[521px]:grid-cols-[5.8rem_minmax(0,1fr)] min-[521px]:gap-2.5"
          key={row.label}
        >
          <dt className="text-neon-label">{row.label}</dt>
          <dd className="m-0 text-ink-row">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function handleLinkClick(label: string, href: string) {
  window.posthog?.capture('social_link_clicked', {
    link_label: label,
    link_href: href,
  })
}

function TerminalLinks({ links }: { links: TerminalLink[] }) {
  return (
    <nav
      aria-label="Social links"
      className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink"
    >
      <span className="m-0 text-ink-muted">press 1-{links.length} for:</span>
      {links.map((link, index) => (
        <a
          className="inline-flex items-center gap-1.25 outline-none hover:text-neon-command focus-visible:text-neon-command"
          href={link.href}
          key={link.label}
          target="_blank"
          rel="noopener noreferrer"
          data-terminal-shortcut={index + 1}
          onClick={() => handleLinkClick(link.label, link.href)}
        >
          <span className="text-neon">[{index + 1}]</span>
          {link.label}
        </a>
      ))}
    </nav>
  )
}

function HomeTerminalBody() {
  return (
    <>
      <div className="grid gap-2">
        <CommandLine>{profile.command}</CommandLine>
        <h1 className="m-0 font-display text-[clamp(1.8rem,6vw,1.875rem)] font-semibold leading-[1.12] text-ink">
          {profile.name}
        </h1>
        <p className="m-0 max-w-xl text-[0.9375rem] leading-[1.32] text-ink-muted">
          {profile.description}
        </p>
      </div>

      <StatusOutput lines={profile.statusLines} />

      <div className="grid gap-1.75">
        <CommandLine>{profile.snapshotCommand}</CommandLine>
        <SnapshotRows rows={profile.snapshotRows} />
      </div>
    </>
  )
}

export function HomeTerminal() {
  return (
    <TerminalWindow
      title={profile.title}
      body={<HomeTerminalBody />}
      footer={<TerminalLinks links={profile.links} />}
    />
  )
}
