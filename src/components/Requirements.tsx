import { REQUIREMENTS } from '../data'
import { isRequirementMet } from '../planner'

type RequirementsProps = {
  selectedIds: string[]
}

export function Requirements({ selectedIds }: RequirementsProps) {
  return (
    <section className="section requirements" aria-labelledby="req-heading">
      <div className="section-inner">
        <p className="eyebrow">Degree</p>
        <h2 id="req-heading" className="section-title">
          Remaining requirements.
        </h2>
        <p className="section-lead">
          A short list for this term — not a full audit. Each one is either in
          the plan or still open.
        </p>

        <ol className="req-list">
          {REQUIREMENTS.map((requirement, index) => {
            const met = isRequirementMet(requirement, selectedIds)
            return (
              <li key={requirement.id} className="req-row">
                <span className="req-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{requirement.label}</h3>
                <p className={met ? 'req-state is-met' : 'req-state'}>
                  {met ? 'In plan' : 'Still open'}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
