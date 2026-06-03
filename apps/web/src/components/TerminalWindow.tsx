import type { ReactNode } from 'react'

type TerminalWindowProps = {
  title: ReactNode
  body: ReactNode
  footer?: ReactNode
}

function WindowControls() {
  return (
    <div className="flex flex-none gap-2.5" aria-hidden="true">
      <span className="size-3 rounded-full bg-control-close" />
      <span className="size-3 rounded-full bg-control-minimize" />
      <span className="size-3 rounded-full bg-control-zoom" />
    </div>
  )
}

function TerminalGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 flex-none stroke-current text-neon-icon"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m6 8 4 4-4 4" />
      <path d="M12 16h6" />
    </svg>
  )
}

export function TerminalWindow({ title, body, footer }: TerminalWindowProps) {
  return (
    <section
      className="relative z-10 grid min-h-[min(32.75rem,calc(100vh-3rem))] w-[min(100%,40rem)] grid-rows-[auto_1fr] overflow-hidden rounded-lg border border-terminal-border bg-terminal shadow-terminal max-[520px]:min-h-auto"
      aria-label="Terminal window"
    >
      <header className="flex min-h-10.5 items-center gap-2.5 bg-terminal-bar px-4">
        <WindowControls />
        <div className="flex min-w-0 items-center gap-2">
          <TerminalGlyph />
          <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[0.8125rem] font-medium text-ink-soft">
            {title}
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-col gap-3 bg-terminal-body px-7 py-5 max-[520px]:p-4.5">
        {body}
      </div>

      {footer ? (
        <footer className="flex min-h-10 items-center border-terminal-border border-t bg-terminal-footer px-7 max-[520px]:px-4.5 max-[520px]:py-3">
          {footer}
        </footer>
      ) : null}
    </section>
  )
}
