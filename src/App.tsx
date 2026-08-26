import { useMemo, useState } from 'react'
import { Catalog } from './components/Catalog'
import { Finale } from './components/Finale'
import { Nav } from './components/Nav'
import { Preferences } from './components/Preferences'
import { Requirements } from './components/Requirements'
import { Status } from './components/Status'
import { Timetable } from './components/Timetable'
import { CREDIT_MAX, CREDIT_MIN, INITIAL_PLANNER } from './data'
import {
  findConflicts,
  getSelectedCourses,
  isPlanReady,
  sumCredits,
} from './planner'
import type { PlannerState } from './types'

export default function App() {
  const [planner, setPlanner] = useState<PlannerState>(INITIAL_PLANNER)
  const [reviewOpen, setReviewOpen] = useState(false)

  const selectedCourses = useMemo(
    () => getSelectedCourses(planner.selectedIds),
    [planner.selectedIds],
  )
  const creditTotal = sumCredits(selectedCourses)
  const conflicts = findConflicts(planner)
  const ready = isPlanReady(planner)

  function update(partial: Partial<PlannerState>) {
    setPlanner((current) => ({ ...current, ...partial }))
  }

  function addCourse(id: string) {
    setPlanner((current) =>
      current.selectedIds.includes(id)
        ? current
        : { ...current, selectedIds: [...current.selectedIds, id] },
    )
  }

  function removeCourse(id: string) {
    setPlanner((current) => ({
      ...current,
      selectedIds: current.selectedIds.filter((selectedId) => selectedId !== id),
    }))
  }

  return (
    <div
      className="app"
      data-max-credits={planner.maxCredits}
      data-no-eight-am={String(planner.noEightAm)}
      data-friday-free={String(planner.fridayFree)}
      data-tuesday-eleven={planner.tuesdayElevenBlocked ? 'blocked' : 'available'}
      data-selected-ids={planner.selectedIds.join(',')}
      data-credit-total={creditTotal}
    >
      <a
        className="skip"
        href="#main"
        onClick={() => {
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
      <Nav />

      <main id="main" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <h1 id="hero-heading">
              Build a semester
              <br />
              that fits your life.
            </h1>
            <p className="hero-lead">
              Balance biology requirements with the hours you keep. This plan is
              local, visible, and yours to change — the same schedule a student
              and an agent will later share.
            </p>

            <dl className="hero-context">
              <div>
                <dt>Program</dt>
                <dd>Biology</dd>
              </div>
              <div>
                <dt>Term</dt>
                <dd>Fall 2026</dd>
              </div>
            </dl>

            <Preferences
              planner={planner}
              onMaxCredits={(value) =>
                update({
                  maxCredits: Math.min(CREDIT_MAX, Math.max(CREDIT_MIN, value)),
                })
              }
              onToggleNoEightAm={() => update({ noEightAm: !planner.noEightAm })}
              onToggleFridayFree={() => update({ fridayFree: !planner.fridayFree })}
              onTuesdayEleven={(blocked) =>
                update({ tuesdayElevenBlocked: blocked })
              }
            />
          </div>

          <div className="hero-plan">
            <header className="plan-head">
              <div>
                <p className="eyebrow eyebrow-on-dark">Current plan</p>
                <p className="plan-credits" aria-live="polite">
                  <span className="plan-credits-num">
                    {creditTotal}
                    <span className="plan-credits-max"> / {planner.maxCredits}</span>
                  </span>
                  <span className="plan-credits-label">credits</span>
                </p>
              </div>
              <p className="plan-count">
                {selectedCourses.length}{' '}
                {selectedCourses.length === 1 ? 'course' : 'courses'}
              </p>
            </header>
            <Timetable courses={selectedCourses} planner={planner} />
          </div>
        </section>

        <Requirements selectedIds={planner.selectedIds} />
        <Catalog planner={planner} onAdd={addCourse} onRemove={removeCourse} />
        <Status
          creditTotal={creditTotal}
          maxCredits={planner.maxCredits}
          courseCount={selectedCourses.length}
          conflicts={conflicts}
          ready={ready}
        />
        <Finale
          planner={planner}
          courses={selectedCourses}
          creditTotal={creditTotal}
          ready={ready}
          open={reviewOpen}
          onOpen={() => setReviewOpen(true)}
          onClose={() => setReviewOpen(false)}
        />
      </main>

      <footer className="site-foot">
        <p>Fictional demonstration. No registration is submitted.</p>
      </footer>
    </div>
  )
}
