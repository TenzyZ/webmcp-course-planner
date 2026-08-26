type StatusProps = {
  creditTotal: number
  maxCredits: number
  courseCount: number
  conflicts: string[]
  ready: boolean
}

export function Status({
  creditTotal,
  maxCredits,
  courseCount,
  conflicts,
  ready,
}: StatusProps) {
  const conflictLabel =
    conflicts.length === 0 ? 'No time conflicts' : conflicts[0]

  return (
    <section className="section status-section" aria-labelledby="status-heading">
      <div className="section-inner">
        <div className="status-panel glass">
          <div>
            <p className="eyebrow" id="status-heading">
              Schedule status
            </p>
            <h2 className="status-title">
              {ready ? 'Ready to review' : 'Needs attention'}
            </h2>
          </div>
          <ul className="status-facts">
            <li>
              {creditTotal} / {maxCredits} credits
            </li>
            <li>
              {courseCount} {courseCount === 1 ? 'course' : 'courses'}
            </li>
            <li>{conflictLabel}</li>
          </ul>
          {conflicts.length > 1 ? (
            <p className="status-more">{conflicts.slice(1).join(' · ')}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
