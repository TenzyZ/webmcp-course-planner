type StatusProps = {
  creditTotal: number
  maxCredits: number
  courseCount: number
  conflicts: string[]
  ready: boolean
  openRequirementLabels: string[]
  lastActivity: string | null
}

export function Status({
  creditTotal,
  maxCredits,
  courseCount,
  conflicts,
  ready,
  openRequirementLabels,
  lastActivity,
}: StatusProps) {
  const conflictLabel =
    conflicts.length === 0 ? 'No time conflicts' : conflicts[0]
  const readyLabel =
    ready && openRequirementLabels.length === 1
      ? `Ready to review · ${openRequirementLabels[0]} still open`
      : ready && openRequirementLabels.length > 1
        ? `Ready to review · ${openRequirementLabels.length} requirements still open`
        : 'Ready to review'

  return (
    <section className="section status-section" aria-labelledby="status-heading">
      <div className="section-inner">
        <div className="status-panel glass">
          <div>
            <p className="eyebrow" id="status-heading">
              Schedule status
            </p>
            <h2 className="status-title">
              {ready ? readyLabel : 'Needs attention'}
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
          {lastActivity ? (
            <p className="status-activity">
              Last agent action · {lastActivity}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
