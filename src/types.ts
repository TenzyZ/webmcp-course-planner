export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'

export type Meeting = {
  days: Day[]
  start: string
  end: string
}

export type Course = {
  id: string
  code: string
  title: string
  credits: number
  seats: number
  meetings: Meeting[]
}

export type Requirement = {
  id: string
  label: string
  fulfilledBy: string[]
}

export type PlannerState = {
  maxCredits: number
  noEightAm: boolean
  fridayFree: boolean
  tuesdayElevenBlocked: boolean
  selectedIds: string[]
}
