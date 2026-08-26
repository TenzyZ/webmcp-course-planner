import {
  DAYS,
  DAY_LABELS,
  GRID_END_MINUTES,
  GRID_START_MINUTES,
  SLOT_MINUTES,
} from '../data'
import {
  formatHourLabel,
  formatTime,
  scheduleSummary,
  toMinutes,
} from '../planner'
import type { Course, Day, PlannerState } from '../types'

type TimetableProps = {
  courses: Course[]
  planner: PlannerState
}

function rowFor(minutes: number): number {
  const clamped = Math.min(Math.max(minutes, GRID_START_MINUTES), GRID_END_MINUTES)
  return Math.round((clamped - GRID_START_MINUTES) / SLOT_MINUTES) + 2
}

function columnFor(day: Day): number {
  return DAYS.indexOf(day) + 2
}

const SLOT_COUNT = (GRID_END_MINUTES - GRID_START_MINUTES) / SLOT_MINUTES
const HOURS = Array.from(
  { length: (GRID_END_MINUTES - GRID_START_MINUTES) / 60 },
  (_, index) => 8 + index,
)

export function Timetable({ courses, planner }: TimetableProps) {
  const summary = scheduleSummary(courses, planner)

  return (
    <div className="timetable">
      <p className="sr-only tt-summary">{summary}</p>

      <div
        className="tt-grid"
        aria-hidden="true"
        style={{
          gridTemplateRows: `36px repeat(${SLOT_COUNT}, minmax(18px, 1fr))`,
        }}
      >
        <div className="tt-corner" />
        {DAYS.map((day) => (
          <div key={day} className="tt-day">
            {DAY_LABELS[day]}
          </div>
        ))}

        {HOURS.map((hour) => {
          const startRow = rowFor(hour * 60)
          return (
            <div
              key={hour}
              className="tt-hour"
              style={{ gridColumn: 1, gridRow: `${startRow} / ${startRow + 2}` }}
            >
              {formatHourLabel(hour)}
            </div>
          )
        })}

        {HOURS.map((hour) => (
          <div
            key={`line-${hour}`}
            className="tt-line"
            style={{
              gridColumn: '2 / -1',
              gridRow: rowFor(hour * 60),
            }}
          />
        ))}

        {planner.noEightAm ? (
          <div
            className="tt-avoid"
            style={{
              gridColumn: planner.fridayFree ? '2 / 6' : '2 / -1',
              gridRow: '2 / 4',
            }}
            title="No 8 AM classes"
          />
        ) : null}

        {planner.fridayFree ? (
          <div
            className="tt-free"
            style={{ gridColumn: columnFor('Fri'), gridRow: '2 / -1' }}
          >
            <span>Held open</span>
          </div>
        ) : null}

        {planner.tuesdayElevenBlocked ? (
          <div
            className={`tt-blocked${courses.some((course) =>
              course.meetings.some(
                (meeting) =>
                  meeting.days.includes('Tue') &&
                  toMinutes(meeting.start) < 12 * 60 &&
                  toMinutes(meeting.end) > 11 * 60,
              ),
            )
              ? ' is-occupied'
              : ''}`}
            style={{
              gridColumn: columnFor('Tue'),
              gridRow: `${rowFor(11 * 60)} / ${rowFor(12 * 60)}`,
            }}
          >
            Blocked
          </div>
        ) : null}

        {courses.flatMap((course) =>
          course.meetings.flatMap((meeting) =>
            meeting.days.map((day) => (
              <article
                key={`${course.id}-${day}-${meeting.start}`}
                className="tt-event"
                style={{
                  gridColumn: columnFor(day),
                  gridRow: `${rowFor(toMinutes(meeting.start))} / ${rowFor(toMinutes(meeting.end))}`,
                }}
              >
                <p className="tt-event-code">{course.code}</p>
                <p className="tt-event-title">{course.title}</p>
                <p className="tt-event-time">{formatTime(meeting.start)}</p>
              </article>
            )),
          ),
        )}
      </div>

      <div className="tt-list">
        {DAYS.map((day) => {
          const dayCourses = courses.flatMap((course) =>
            course.meetings
              .filter((meeting) => meeting.days.includes(day))
              .map((meeting) => ({ course, meeting })),
          )

          return (
            <section key={day} className="tt-list-day">
              <h3>{DAY_LABELS[day]}</h3>
              {day === 'Fri' && planner.fridayFree ? (
                <p className="tt-list-note">Friday is held open.</p>
              ) : null}
              {day === 'Tue' && planner.tuesdayElevenBlocked ? (
                <p className="tt-list-note">11:00 AM is blocked.</p>
              ) : null}
              {dayCourses.length === 0 &&
              !(day === 'Fri' && planner.fridayFree) &&
              !(day === 'Tue' && planner.tuesdayElevenBlocked) ? (
                <p className="tt-list-empty">No classes</p>
              ) : null}
              <ul>
                {dayCourses.map(({ course, meeting }) => (
                  <li key={`${course.id}-${meeting.start}`}>
                    <span>
                      {formatTime(meeting.start)}–{formatTime(meeting.end)}
                    </span>
                    <strong>
                      {course.code} {course.title}
                    </strong>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
