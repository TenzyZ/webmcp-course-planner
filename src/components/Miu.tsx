import { useEffect, useState } from 'react'
import celebrateImage from '../assets/miu/miu-celebrate.png'
import conflictImage from '../assets/miu/miu-conflict.png'
import idleImage from '../assets/miu/miu-idle.png'
import idleGreetingImage from '../assets/miu/miu-idle-greeting.png'
import idleClosedSmileImage from '../assets/miu/frame-animation/miu-idle-closed-smile.png'
import idleHalfCloseSmileImage from '../assets/miu/frame-animation/miu-idle-half-close-smile.png'
import readingImage from '../assets/miu/miu-reading.png'
import readyImage from '../assets/miu/miu-ready.png'
import workingImage from '../assets/miu/miu-working.png'
import type { MiuPose, MiuPresentation } from '../miuStatus'

const idleExpressionImages = [
  idleImage,
  idleHalfCloseSmileImage,
  idleClosedSmileImage,
  idleHalfCloseSmileImage,
]
const idleCadence = [3600, 4200, 3800, 4400]
const greetingDuration = 2400
const clickDuration = 1400

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

const poseImages: Record<MiuPose, string> = {
  idle: idleImage,
  reading: readingImage,
  working: workingImage,
  ready: readyImage,
  conflict: conflictImage,
  celebrate: celebrateImage,
}

const preloadedImages = [
  ...Object.values(poseImages),
  idleGreetingImage,
  idleHalfCloseSmileImage,
  idleClosedSmileImage,
]

type LocalMode = 'greeting' | 'idle' | 'click'

type LocalPresentation = {
  eventId: number
  mode: LocalMode
  frame: number
  reactionId: number
}

type MiuCopy = Pick<
  MiuPresentation,
  'label' | 'headline' | 'message' | 'detail'
>

export function Miu({ status }: { status: MiuPresentation }) {
  const [local, setLocal] = useState<LocalPresentation>(() => ({
    eventId: status.eventId,
    mode: status.pose === 'idle' ? 'greeting' : 'idle',
    frame: 0,
    reactionId: 0,
  }))
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia(reducedMotionQuery).matches,
  )
  const localMode: LocalMode =
    status.pose === 'idle' && local.eventId === status.eventId
      ? local.mode
      : 'idle'

  useEffect(() => {
    preloadedImages.forEach((image) => {
      const preload = new Image()
      preload.src = image
    })
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery)
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
      setLocal((current) => ({ ...current, frame: 0 }))
    }

    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (status.pose !== 'idle' || localMode !== 'greeting') return

    const timer = window.setTimeout(() => {
      setLocal((current) =>
        current.eventId === status.eventId && current.mode === 'greeting'
          ? { ...current, mode: 'idle', frame: 0 }
          : current,
      )
    }, greetingDuration)

    return () => window.clearTimeout(timer)
  }, [localMode, status.eventId, status.pose])

  useEffect(() => {
    if (
      status.pose !== 'idle' ||
      localMode !== 'idle' ||
      prefersReducedMotion
    ) {
      return
    }

    let timer: number
    let cadenceIndex = 0
    const updateFrame = (frame: number) => {
      setLocal((current) =>
        current.eventId !== status.eventId || current.mode === 'idle'
          ? { ...current, eventId: status.eventId, mode: 'idle', frame }
          : current,
      )
    }
    const scheduleExpression = () => {
      timer = window.setTimeout(() => {
        updateFrame(1)
        timer = window.setTimeout(() => {
          updateFrame(2)
          timer = window.setTimeout(() => {
            updateFrame(3)
            timer = window.setTimeout(() => {
              updateFrame(0)
              cadenceIndex = (cadenceIndex + 1) % idleCadence.length
              scheduleExpression()
            }, 100)
          }, 120)
        }, 100)
      }, idleCadence[cadenceIndex])
    }

    scheduleExpression()
    return () => window.clearTimeout(timer)
  }, [localMode, prefersReducedMotion, status.eventId, status.pose])

  useEffect(() => {
    if (status.pose !== 'idle' || localMode !== 'click') return

    const reactionId = local.reactionId
    const updateClickFrame = (frame: number) => {
      setLocal((current) =>
        current.eventId === status.eventId &&
        current.mode === 'click' &&
        current.reactionId === reactionId
          ? { ...current, frame }
          : current,
      )
    }
    const timers = prefersReducedMotion
      ? []
      : [
          window.setTimeout(() => updateClickFrame(2), 100),
          window.setTimeout(() => updateClickFrame(3), 220),
          window.setTimeout(() => updateClickFrame(0), 320),
        ]

    timers.push(
      window.setTimeout(() => {
        setLocal((current) =>
          current.eventId === status.eventId &&
          current.mode === 'click' &&
          current.reactionId === reactionId
            ? { ...current, mode: 'idle', frame: 0 }
            : current,
        )
      }, clickDuration),
    )

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [local.reactionId, localMode, prefersReducedMotion, status.eventId, status.pose])

  const showClickReaction = () => {
    if (status.pose !== 'idle') return

    setLocal((current) => ({
      eventId: status.eventId,
      mode: 'click',
      frame: prefersReducedMotion ? 0 : 1,
      reactionId: current.reactionId + 1,
    }))
  }

  const image =
    status.pose !== 'idle'
      ? poseImages[status.pose]
      : localMode === 'greeting'
        ? idleGreetingImage
        : prefersReducedMotion
          ? idleImage
          : idleExpressionImages[
              local.eventId === status.eventId ? local.frame : 0
            ]
  const copy: MiuCopy =
    status.pose === 'idle' && localMode === 'greeting'
      ? {
          headline: "Hi! I'm Miu",
          message: "I'll show WebMCP activity here.",
        }
      : status.pose === 'idle' && localMode === 'click'
        ? { headline: "I'm here!" }
        : status
  const motionKey =
    status.pose !== 'idle'
      ? `pose-${status.pose}-${status.eventId}`
      : localMode === 'click'
        ? `click-${local.reactionId}`
        : `${localMode}-${status.eventId}`
  const emoji =
    status.pose === 'idle' && localMode === 'greeting'
      ? '👋'
      : status.pose === 'idle' && localMode === 'click'
        ? '✨'
        : null

  return (
    <aside
      className={`miu miu--${status.pose}${
        status.pose === 'idle' && localMode === 'click'
          ? ' miu--local-click'
          : ''
      }`}
      data-human-change={String(Boolean(status.humanChange))}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="miu-card" key={`copy-${status.eventId}`}>
        {copy.label ? <p className="miu-label">{copy.label}</p> : null}
        <p className="miu-headline">
          {copy.headline}
          {emoji ? <span aria-hidden="true"> {emoji}</span> : null}
        </p>
        {copy.message ? <p className="miu-message">{copy.message}</p> : null}
        {copy.detail ? <p className="miu-detail">{copy.detail}</p> : null}
      </div>

      <button
        type="button"
        className="miu-character"
        aria-label="Say hi to Miu"
        disabled={status.pose !== 'idle'}
        onClick={showClickReaction}
      >
        <span className="miu-character-motion" key={motionKey}>
          <img className="miu-art" src={image} alt="" />
          <span className="miu-glint" />
          <span className="miu-confetti">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} />
            ))}
          </span>
        </span>
      </button>
    </aside>
  )
}
