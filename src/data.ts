import type { Course, PlannerState, Requirement } from './types'

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

export const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
}

export const COURSES: Course[] = [
  {
    id: 'biol-301',
    code: 'BIOL 301',
    title: 'Genetics',
    credits: 4,
    seats: 18,
    meetings: [{ days: ['Mon', 'Wed'], start: '10:00', end: '11:20' }],
  },
  {
    id: 'biol-240',
    code: 'BIOL 240',
    title: 'Cell Biology',
    credits: 4,
    seats: 16,
    meetings: [{ days: ['Tue', 'Thu'], start: '14:00', end: '15:20' }],
  },
  {
    id: 'chem-220',
    code: 'CHEM 220',
    title: 'Foundations of Chemistry',
    credits: 3,
    seats: 22,
    meetings: [{ days: ['Mon', 'Wed'], start: '13:00', end: '14:20' }],
  },
  {
    id: 'biol-310',
    code: 'BIOL 310',
    title: 'Ecology',
    credits: 3,
    seats: 14,
    meetings: [{ days: ['Thu'], start: '09:00', end: '10:50' }],
  },
  {
    id: 'stat-210',
    code: 'STAT 210',
    title: 'Applied Statistics',
    credits: 3,
    seats: 12,
    meetings: [{ days: ['Tue', 'Thu'], start: '11:00', end: '12:20' }],
  },
  {
    id: 'biol-350',
    code: 'BIOL 350',
    title: 'Developmental Biology',
    credits: 3,
    seats: 15,
    meetings: [{ days: ['Mon', 'Wed'], start: '11:00', end: '12:20' }],
  },
  {
    id: 'chem-110',
    code: 'CHEM 110',
    title: 'General Chemistry',
    credits: 4,
    seats: 28,
    meetings: [{ days: ['Mon', 'Wed', 'Fri'], start: '08:00', end: '08:50' }],
  },
  {
    id: 'biol-180',
    code: 'BIOL 180',
    title: 'Field Seminar',
    credits: 2,
    seats: 10,
    meetings: [{ days: ['Fri'], start: '09:00', end: '10:50' }],
  },
]

export const REQUIREMENTS: Requirement[] = [
  { id: 'genetics', label: 'Genetics', fulfilledBy: ['biol-301'] },
  { id: 'statistics', label: 'Statistics', fulfilledBy: ['stat-210'] },
  { id: 'ecology', label: 'Ecology', fulfilledBy: ['biol-310'] },
]

export const INITIAL_PLANNER: PlannerState = {
  maxCredits: 15,
  noEightAm: true,
  fridayFree: true,
  tuesdayElevenBlocked: false,
  selectedIds: ['biol-301', 'biol-240', 'chem-220', 'biol-310'],
}

export const CREDIT_MIN = 6
export const CREDIT_MAX = 21

export const GRID_START_MINUTES = 8 * 60
export const GRID_END_MINUTES = 17 * 60
export const SLOT_MINUTES = 30

export const TUESDAY_ELEVEN = {
  days: ['Tue'] as const,
  start: '11:00',
  end: '12:00',
}
