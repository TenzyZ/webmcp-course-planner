import { useEffect, useMemo, useRef, useState } from 'react'
import { Catalog } from './components/Catalog'
import { Finale } from './components/Finale'
import { Miu } from './components/Miu'
import { Nav } from './components/Nav'
import { Preferences } from './components/Preferences'
import { Requirements } from './components/Requirements'
import { Status } from './components/Status'
import { Timetable } from './components/Timetable'
import {
  COURSES,
  CREDIT_MAX,
  CREDIT_MIN,
  INITIAL_PLANNER,
  REQUIREMENTS,
} from './data'
import {
  courseConflictNotes,
  findConflicts,
  formatCourseMeetings,
  getCourse,
  getSelectedCourses,
  isPlanReady,
  isRequirementMet,
  sumCredits,
} from './planner'
import { useMiuStatus } from './miuStatus'
import type { PlannerState } from './types'

export default function App() {
  const [planner, setPlanner] = useState<PlannerState>(INITIAL_PLANNER)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [confirmedPlanSignature, setConfirmedPlanSignature] = useState<
    string | null
  >(null)
  const plannerRef = useRef(planner)
  const humanEditRef = useRef(false)
  const {
    status: miuStatus,
    onRead,
    onWrite,
    onRejected,
    onCelebrate,
  } = useMiuStatus()
  const plannerSignature = JSON.stringify(planner)
  const registrationConfirmed = confirmedPlanSignature === plannerSignature

  useEffect(() => {
    plannerRef.current = planner
  }, [planner])

  useEffect(() => {
    const modelContext = document.modelContext
    if (!modelContext) return

    const controller = new AbortController()

    void Promise.all([
      modelContext.registerTool(
        {
          name: 'get_course_plan',
          description:
            'Read the current course plan, preferences, requirements, catalog, and deterministic planning notes.',
          inputSchema: { type: 'object', properties: {} },
          annotations: { readOnlyHint: true },
          execute: () => {
            const current = plannerRef.current
            const selectedCourses = getSelectedCourses(current.selectedIds)
            const conflicts = findConflicts(current)

            const result = {
              preferences: {
                maxCredits: current.maxCredits,
                noEightAm: current.noEightAm,
                fridayFree: current.fridayFree,
                tuesdayElevenBlocked: current.tuesdayElevenBlocked,
              },
              creditTotal: sumCredits(selectedCourses),
              ready: isPlanReady(current),
              conflicts,
              selectedCourseIds: current.selectedIds,
              requirements: REQUIREMENTS.map((requirement) => ({
                label: requirement.label,
                met: isRequirementMet(requirement, current.selectedIds),
                courseIds: requirement.fulfilledBy,
              })),
              catalog: COURSES.map((course) => ({
                id: course.id,
                code: course.code,
                title: course.title,
                credits: course.credits,
                meetings: formatCourseMeetings(course),
                selected: current.selectedIds.includes(course.id),
                notes: courseConflictNotes(course, current),
              })),
            }

            const humanChange = humanEditRef.current
            onRead(humanChange, conflicts[0])
            humanEditRef.current = false
            return result
          },
        },
        { signal: controller.signal },
      ),
      modelContext.registerTool(
        {
          name: 'set_course_plan',
          description:
            'Replace the selected courses with an exact set of valid catalog course IDs and assess the resulting plan.',
          inputSchema: {
            type: 'object',
            properties: {
              courseIds: {
                type: 'array',
                items: { type: 'string' },
                description:
                  'Exact catalog course IDs that should make up the plan. Replaces the current selected course set.',
              },
            },
            required: ['courseIds'],
          },
          annotations: { readOnlyHint: false },
          execute: (input) => {
            try {
              const courseIds = input?.courseIds
              if (!Array.isArray(courseIds)) {
                throw new TypeError('courseIds must be an array')
              }
              if (!courseIds.every((id): id is string => typeof id === 'string')) {
                throw new TypeError('Every courseIds item must be a string')
              }

              const selectedIds = [...new Set(courseIds)]
              const unknownIds = selectedIds.filter((id) => !getCourse(id))
              if (unknownIds.length > 0) {
                throw new RangeError(
                  `Unknown course ID(s): ${unknownIds.join(', ')}. Plan left unchanged.`,
                )
              }

              const nextPlanner = {
                ...plannerRef.current,
                selectedIds,
              }
              const selectedCourses = getSelectedCourses(selectedIds)
              const conflicts = findConflicts(nextPlanner)

              setPlanner((current) => ({
                ...current,
                selectedIds,
              }))
              onWrite(conflicts[0])

              return {
                selectedCourseIds: selectedIds,
                creditTotal: sumCredits(selectedCourses),
                ready: isPlanReady(nextPlanner),
                conflicts,
              }
            } catch (error: unknown) {
              onRejected(error instanceof Error ? error.message : String(error))
              throw error
            }
          },
        },
        { signal: controller.signal },
      ),
    ]).catch((error: unknown) => {
      if (!controller.signal.aborted) {
        console.error('Failed to register WebMCP tools', error)
      }
    })

    return () => controller.abort()
  }, [onRead, onRejected, onWrite])

  const selectedCourses = useMemo(
    () => getSelectedCourses(planner.selectedIds),
    [planner.selectedIds],
  )
  const creditTotal = sumCredits(selectedCourses)
  const conflicts = findConflicts(planner)
  const ready = isPlanReady(planner)

  function update(partial: Partial<PlannerState>) {
    humanEditRef.current = true
    setPlanner((current) => ({ ...current, ...partial }))
  }

  function addCourse(id: string) {
    humanEditRef.current = true
    setPlanner((current) =>
      current.selectedIds.includes(id)
        ? current
        : { ...current, selectedIds: [...current.selectedIds, id] },
    )
  }

  function removeCourse(id: string) {
    humanEditRef.current = true
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
              local, visible, and yours to change. A student and an agent will
              later share the same schedule.
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
                blocked === planner.tuesdayElevenBlocked
                  ? undefined
                  : update({ tuesdayElevenBlocked: blocked })
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
                {conflicts.length > 0 ? (
                  <p className="plan-conflict" role="status">
                    {conflicts[0]}
                  </p>
                ) : null}
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
          registrationConfirmed={registrationConfirmed}
          onOpen={() => setReviewOpen(true)}
          onClose={() => setReviewOpen(false)}
          onConfirm={() => {
            setConfirmedPlanSignature(plannerSignature)
            onCelebrate()
          }}
        />
      </main>

      <Miu status={miuStatus} />

      <footer className="site-foot">
        <p>Fictional demonstration. No registration is submitted.</p>
      </footer>
    </div>
  )
}
