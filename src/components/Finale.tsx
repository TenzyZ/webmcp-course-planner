import { useEffect, useRef } from 'react'
import { formatCourseMeetings } from '../planner'
import type { Course, PlannerState } from '../types'

type FinaleProps = {
  planner: PlannerState
  courses: Course[]
  creditTotal: number
  ready: boolean
  open: boolean
  registrationConfirmed: boolean
  onOpen: () => void
  onClose: () => void
  onConfirm: () => void
}

export function Finale({
  planner,
  courses,
  creditTotal,
  ready,
  open,
  registrationConfirmed,
  onOpen,
  onClose,
  onConfirm,
}: FinaleProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    function handleClose() {
      onClose()
      triggerRef.current?.focus()
    }

    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  return (
    <section className="finale" aria-labelledby="finale-heading">
      <div className="finale-copy">
        <h2 id="finale-heading">
          Your semester,
          <br />
          ready for review.
        </h2>
        <p>
          Confirm the plan as it stands. This is a demonstration — nothing is
          sent to a registrar.
        </p>
        <button
          ref={triggerRef}
          type="button"
          className="btn btn-light"
          onClick={onOpen}
        >
          Review schedule
        </button>
      </div>

      <div className="finale-orb" aria-hidden="true">
        <span className="finale-orb-num">{creditTotal}</span>
        <span className="finale-orb-label">credits</span>
      </div>

      <dialog
        ref={dialogRef}
        className="review-dialog"
        aria-labelledby="review-title"
      >
        <h2 id="review-title">Review schedule</h2>
        <p className="review-kicker">
          {ready ? 'This plan is ready to review.' : 'This plan still has notes.'}
        </p>

        <dl className="review-dl">
          <div>
            <dt>Term</dt>
            <dd>Biology · Fall 2026</dd>
          </div>
          <div>
            <dt>Credits</dt>
            <dd>
              {creditTotal} / {planner.maxCredits}
            </dd>
          </div>
          <div>
            <dt>No 8 AM classes</dt>
            <dd>{planner.noEightAm ? 'On' : 'Off'}</dd>
          </div>
          <div>
            <dt>Keep Friday free</dt>
            <dd>{planner.fridayFree ? 'On' : 'Off'}</dd>
          </div>
          <div>
            <dt>Tuesday · 11:00 AM</dt>
            <dd>{planner.tuesdayElevenBlocked ? 'Blocked' : 'Available'}</dd>
          </div>
        </dl>

        <h3 className="review-sub">Courses</h3>
        {courses.length === 0 ? (
          <p>No courses selected.</p>
        ) : (
          <ul className="review-courses">
            {courses.map((course) => (
              <li key={course.id}>
                <strong>
                  {course.code} {course.title}
                </strong>
                <span>
                  {formatCourseMeetings(course)} · {course.credits} credits
                </span>
              </li>
            ))}
          </ul>
        )}

        <p className="review-disclaimer">
          This is a fictional demonstration. No university registration will be
          submitted.
        </p>

        <p role="status">
          {registrationConfirmed
            ? 'Registration confirmed for this fictional demonstration. Nothing was sent to a real university.'
            : ''}
        </p>

        <form method="dialog" className="review-actions">
          <button type="submit" className="btn btn-ghost">
            Close
          </button>
          <button
            type="button"
            className="btn btn-solid"
            disabled={!ready}
            onClick={onConfirm}
          >
            {registrationConfirmed
              ? 'Registration confirmed'
              : 'Confirm registration'}
          </button>
        </form>
      </dialog>
    </section>
  )
}
