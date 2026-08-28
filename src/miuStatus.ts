import { useCallback, useEffect, useRef, useState } from 'react'

export type MiuPose =
  | 'idle'
  | 'reading'
  | 'working'
  | 'ready'
  | 'conflict'
  | 'celebrate'

export type MiuPresentation = {
  eventId: number
  pose: MiuPose
  label?: string
  headline: string
  message?: string
  detail?: string
  humanChange?: boolean
}

const IDLE_STATUS: MiuPresentation = {
  eventId: 0,
  pose: 'idle',
  headline: 'I show WebMCP activity on this page.',
}

const STATUS_DURATION_MS = 3600
const WRITE_REACTION_MS = 500

export function useMiuStatus() {
  const [status, setStatus] = useState(IDLE_STATUS)
  const timerRef = useRef<number | null>(null)
  const eventIdRef = useRef(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const showThenIdle = useCallback(
    (next: Omit<MiuPresentation, 'eventId'>, duration = STATUS_DURATION_MS) => {
      clearTimer()
      const eventId = ++eventIdRef.current
      setStatus({ ...next, eventId })
      timerRef.current = window.setTimeout(() => {
        setStatus({ ...IDLE_STATUS, eventId })
        timerRef.current = null
      }, duration)
    },
    [clearTimer],
  )

  const onRead = useCallback(
    (humanChange: boolean, conflict?: string) => {
      showThenIdle({
        pose: 'reading',
        label: 'WebMCP · get_course_plan',
        headline: 'Read your plan.',
        ...(humanChange ? { message: 'I see your changes.' } : {}),
        detail: conflict ?? 'Your latest plan is loaded.',
        humanChange,
      })
    },
    [showThenIdle],
  )

  const onWrite = useCallback(
    (conflict?: string) => {
      clearTimer()
      const eventId = ++eventIdRef.current
      setStatus({
        eventId,
        pose: 'working',
        label: 'WebMCP · set_course_plan',
        headline: 'Updated your timetable.',
      })
      timerRef.current = window.setTimeout(() => {
        setStatus({
          eventId,
          pose: conflict ? 'conflict' : 'ready',
          label: 'WebMCP · set_course_plan',
          headline: conflict ?? 'Ready for review.',
        })
        timerRef.current = window.setTimeout(() => {
          setStatus({ ...IDLE_STATUS, eventId })
          timerRef.current = null
        }, STATUS_DURATION_MS)
      }, WRITE_REACTION_MS)
    },
    [clearTimer],
  )

  const onRejected = useCallback(
    (message: string) => {
      showThenIdle(
        {
          pose: 'conflict',
          label: 'WebMCP · set_course_plan · rejected',
          headline: message,
        },
        4200,
      )
    },
    [showThenIdle],
  )

  const onCelebrate = useCallback(() => {
    showThenIdle(
      {
        pose: 'celebrate',
        headline: 'Confirmed for this fictional demo.',
      },
      4200,
    )
  }, [showThenIdle])

  useEffect(() => clearTimer, [clearTimer])

  return { status, onRead, onWrite, onRejected, onCelebrate }
}
