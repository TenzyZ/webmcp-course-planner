import { COURSES, DAY_LABELS, TUESDAY_ELEVEN } from './data'
import type { Course, Day, Meeting, PlannerState, Requirement } from './types'

export function toMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatTime(hhmm: string): string {
  const [hours, minutes] = hhmm.split(':').map(Number)
  const hour12 = ((hours + 11) % 12) + 1
  const suffix = hours < 12 ? 'AM' : 'PM'
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

export function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}

export function formatDays(days: Day[]): string {
  return days.map((day) => day).join(' / ')
}

export function formatMeeting(meeting: Meeting): string {
  return `${formatDays(meeting.days)} · ${formatTime(meeting.start)}`
}

export function formatCourseMeetings(course: Course): string {
  return course.meetings.map(formatMeeting).join('; ')
}

export function getCourse(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id)
}

export function getSelectedCourses(selectedIds: string[]): Course[] {
  return selectedIds
    .map((id) => getCourse(id))
    .filter((course): course is Course => course !== undefined)
}

export function sumCredits(courses: Course[]): number {
  return courses.reduce((total, course) => total + course.credits, 0)
}

export function meetingsOverlap(a: Meeting, b: Meeting): boolean {
  const sharesDay = a.days.some((day) => b.days.includes(day))
  if (!sharesDay) return false
  return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end)
}

export function coursesOverlap(a: Course, b: Course): boolean {
  return a.meetings.some((left) => b.meetings.some((right) => meetingsOverlap(left, right)))
}

export function courseStartsBeforeNine(course: Course): boolean {
  return course.meetings.some((meeting) => toMinutes(meeting.start) < 9 * 60)
}

export function courseMeetsFriday(course: Course): boolean {
  return course.meetings.some((meeting) => meeting.days.includes('Fri'))
}

export function courseHitsTuesdayEleven(course: Course): boolean {
  const block: Meeting = {
    days: [...TUESDAY_ELEVEN.days],
    start: TUESDAY_ELEVEN.start,
    end: TUESDAY_ELEVEN.end,
  }
  return course.meetings.some((meeting) => meetingsOverlap(meeting, block))
}

export function findConflicts(planner: PlannerState): string[] {
  const selected = getSelectedCourses(planner.selectedIds)
  const notes: string[] = []
  const credits = sumCredits(selected)

  if (selected.length === 0) {
    notes.push('No courses in the plan')
  }

  if (credits > planner.maxCredits) {
    notes.push(`Over the ${planner.maxCredits}-credit maximum`)
  }

  if (planner.noEightAm && selected.some(courseStartsBeforeNine)) {
    notes.push('Includes an 8 AM class')
  }

  if (planner.fridayFree && selected.some(courseMeetsFriday)) {
    notes.push('Meets on Friday')
  }

  if (planner.tuesdayElevenBlocked && selected.some(courseHitsTuesdayEleven)) {
    notes.push('Tuesday 11:00 AM is blocked')
  }

  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      if (coursesOverlap(selected[i], selected[j])) {
        notes.push('Two classes share a time')
        return notes
      }
    }
  }

  return notes
}

export function isRequirementMet(
  requirement: Requirement,
  selectedIds: string[],
): boolean {
  return requirement.fulfilledBy.some((id) => selectedIds.includes(id))
}

export function isPlanReady(planner: PlannerState): boolean {
  const selected = getSelectedCourses(planner.selectedIds)
  if (selected.length === 0) return false
  return findConflicts(planner).length === 0
}

export function courseConflictNotes(course: Course, planner: PlannerState): string[] {
  const notes: string[] = []
  const selected = getSelectedCourses(planner.selectedIds)

  if (planner.noEightAm && courseStartsBeforeNine(course)) {
    notes.push('Starts at 8 AM')
  }
  if (planner.fridayFree && courseMeetsFriday(course)) {
    notes.push('Meets on Friday')
  }
  if (planner.tuesdayElevenBlocked && courseHitsTuesdayEleven(course)) {
    notes.push('Overlaps Tuesday 11:00 AM')
  }
  if (!planner.selectedIds.includes(course.id)) {
    const clash = selected.find((other) => coursesOverlap(other, course))
    if (clash) notes.push(`Conflicts with ${clash.code}`)
  }
  return notes
}

export function scheduleSummary(courses: Course[], planner: PlannerState): string {
  const days: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  return days
    .map((day) => {
      const items: string[] = []
      if (day === 'Tue' && planner.tuesdayElevenBlocked) {
        items.push('11:00 AM blocked')
      }
      if (day === 'Fri' && planner.fridayFree) {
        items.push('held open')
      }
      for (const course of courses) {
        for (const meeting of course.meetings) {
          if (!meeting.days.includes(day)) continue
          items.push(
            `${course.code} ${course.title} from ${formatTime(meeting.start)} to ${formatTime(meeting.end)}`,
          )
        }
      }
      const detail = items.length > 0 ? items.join('; ') : 'no classes'
      return `${DAY_LABELS[day]}: ${detail}`
    })
    .join('. ')
}
