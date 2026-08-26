import { CREDIT_MAX, CREDIT_MIN } from '../data'
import type { PlannerState } from '../types'

type PreferencesProps = {
  planner: PlannerState
  onMaxCredits: (value: number) => void
  onToggleNoEightAm: () => void
  onToggleFridayFree: () => void
  onTuesdayEleven: (blocked: boolean) => void
}

export function Preferences({
  planner,
  onMaxCredits,
  onToggleNoEightAm,
  onToggleFridayFree,
  onTuesdayEleven,
}: PreferencesProps) {
  const tuesdayLabel = planner.tuesdayElevenBlocked ? 'Blocked' : 'Available'

  return (
    <section className="prefs glass" aria-labelledby="prefs-heading">
      <h2 id="prefs-heading" className="prefs-title">
        Preferences
      </h2>

      <div className="prefs-row">
        <div className="prefs-copy">
          <p id="max-credits-label">Maximum credits</p>
        </div>
        <div className="stepper">
          <button
            type="button"
            className="stepper-btn"
            aria-label="Decrease maximum credits"
            disabled={planner.maxCredits <= CREDIT_MIN}
            onClick={() => onMaxCredits(planner.maxCredits - 1)}
          >
            −
          </button>
          <span className="stepper-value" aria-labelledby="max-credits-label">
            {planner.maxCredits}
          </span>
          <button
            type="button"
            className="stepper-btn"
            aria-label="Increase maximum credits"
            disabled={planner.maxCredits >= CREDIT_MAX}
            onClick={() => onMaxCredits(planner.maxCredits + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="prefs-row">
        <p id="no-eight-label">No 8 AM classes</p>
        <button
          type="button"
          className="switch"
          role="switch"
          aria-checked={planner.noEightAm}
          aria-labelledby="no-eight-label"
          onClick={onToggleNoEightAm}
        >
          <span className="switch-knob" aria-hidden="true" />
          <span className="switch-text">{planner.noEightAm ? 'On' : 'Off'}</span>
        </button>
      </div>

      <div className="prefs-row">
        <p id="friday-label">Keep Friday free</p>
        <button
          type="button"
          className="switch"
          role="switch"
          aria-checked={planner.fridayFree}
          aria-labelledby="friday-label"
          onClick={onToggleFridayFree}
        >
          <span className="switch-knob" aria-hidden="true" />
          <span className="switch-text">{planner.fridayFree ? 'On' : 'Off'}</span>
        </button>
      </div>

      <div className="prefs-row prefs-row-block">
        <div className="prefs-copy">
          <p id="tue-block-label">Tuesday · 11:00 AM</p>
          <p className="prefs-hint" id="tue-block-hint">
            {planner.tuesdayElevenBlocked
              ? 'That hour is held out of the week.'
              : 'Open for a class.'}
          </p>
        </div>
        <div
          className="seg"
          role="group"
          aria-labelledby="tue-block-label"
          aria-describedby="tue-block-hint"
        >
          <button
            type="button"
            aria-pressed={!planner.tuesdayElevenBlocked}
            onClick={() => onTuesdayEleven(false)}
          >
            Available
          </button>
          <button
            type="button"
            aria-pressed={planner.tuesdayElevenBlocked}
            onClick={() => onTuesdayEleven(true)}
          >
            Blocked
          </button>
        </div>
      </div>

      <p className="prefs-live" aria-live="polite">
        Tuesday 11:00 AM is {tuesdayLabel.toLowerCase()}.
      </p>
    </section>
  )
}
