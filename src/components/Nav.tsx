export function Nav() {
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
      </div>
    </header>
  )
}
