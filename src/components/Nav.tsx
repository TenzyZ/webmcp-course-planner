export type WebMcpStatus = 'connecting' | 'ready' | 'unavailable' | 'error'

const WEBMCP_STATUS_LABELS: Record<WebMcpStatus, string> = {
  connecting: 'WebMCP · connecting',
  ready: 'WebMCP · 2 tools ready',
  unavailable: 'WebMCP · not detected',
  error: 'WebMCP · unavailable',
}

export function Nav({ webMcpStatus }: { webMcpStatus: WebMcpStatus }) {
  return (
    <header className="site-nav-wrap">
      <div className="site-nav glass">
        <a className="site-nav-mark" href="#main">
          Course Planner
        </a>
        <p className="site-nav-meta">
          <span>Biology</span>
          <span aria-hidden="true" className="dot">
            ·
          </span>
          <span>Fall 2026</span>
        </p>
        <p
          className="site-nav-status"
          data-status={webMcpStatus}
          role="status"
          aria-live="polite"
        >
          {WEBMCP_STATUS_LABELS[webMcpStatus]}
        </p>
      </div>
    </header>
  )
}
