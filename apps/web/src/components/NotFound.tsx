import { TerminalWindow } from './TerminalWindow'

export function NotFound() {
  return (
    <TerminalWindow
      title={'404: command not found'}
      body={<p>Sorry, I couldn't find that command.</p>}
    />
  )
}
