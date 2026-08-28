import { COURSES } from '../data'
import { courseConflictNotes, formatCourseMeetings } from '../planner'
import type { PlannerState } from '../types'

type CatalogProps = {
  planner: PlannerState
  onAdd: (id: string) => void
  onRemove: (id: string) => void
}

export function Catalog({ planner, onAdd, onRemove }: CatalogProps) {
  return (
    <section className="section catalog" aria-labelledby="catalog-heading">
      <div className="section-inner">
        <p className="eyebrow">Catalog</p>
        <h2 id="catalog-heading" className="section-title">
          Available sections.
        </h2>
        <p className="section-lead">
          A small set of fictional Biology course offerings. Add or remove them
          from this plan.
        </p>

        <ul className="catalog-list">
          {COURSES.map((course) => {
            const selected = planner.selectedIds.includes(course.id)
            const notes = courseConflictNotes(course, planner)
            return (
              <li key={course.id} className="catalog-row">
                <div className="catalog-main">
                  <p className="catalog-code">{course.code}</p>
                  <h3>{course.title}</h3>
                  <p className="catalog-meta">
                    {formatCourseMeetings(course)}
                  </p>
                  <p className="catalog-facts">
                    {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
                    <span aria-hidden="true"> · </span>
                    {course.seats} seats
                  </p>
                  {notes.length > 0 ? (
                    <p className="catalog-notes">{notes.join(' · ')}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={selected ? 'btn btn-ghost' : 'btn btn-solid'}
                  onClick={() => (selected ? onRemove(course.id) : onAdd(course.id))}
                >
                  {selected ? 'Remove' : 'Add'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
