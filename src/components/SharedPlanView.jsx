import ExperienceItem from './ExperienceItem.jsx'
import { prettyDate } from '../lib/datetime.js'

// Read-only view shown when the app is opened from a shared #plan= link.
export default function SharedPlanView({ plan, onStart }) {
  return (
    <div className="screen shared">
      <div className="brand brand--small">
        <span className="brand__mark" aria-hidden="true">✦</span>
        <h1>Whimsy</h1>
      </div>
      <p className="tagline">Someone shared a day with you.</p>

      <section className="plan-card plan-card--static">
        <header className="plan-card__head">
          <div>
            <h2>{plan.city}</h2>
            <p className="muted">{prettyDate(plan.date)}</p>
          </div>
        </header>
        <div className="plan-card__list">
          {plan.experiences.map((x) => (
            <ExperienceItem key={x.id} exp={x} />
          ))}
        </div>
      </section>

      <button className="btn btn--primary" onClick={onStart}>Plan your own day →</button>
    </div>
  )
}
