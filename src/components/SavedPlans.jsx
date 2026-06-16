import ExperienceItem from './ExperienceItem.jsx'
import { prettyDate } from '../lib/datetime.js'
import { sharePlan } from '../lib/share.js'

export default function SavedPlans({ plans, onRemove, onBack, onToast }) {
  async function share(plan) {
    const res = await sharePlan(plan)
    if (res.ok && res.method === 'clipboard') onToast('Shareable link copied ✦')
  }

  return (
    <div className="screen saved">
      <header className="saved__head">
        <button className="link-btn" onClick={onBack}>← Back</button>
        <h2>Saved plans</h2>
        <span className="muted">{plans.length}</span>
      </header>

      {plans.length === 0 ? (
        <div className="empty">
          <p className="empty__big">Nothing saved yet</p>
          <p className="muted">Swipe a day right (or tap ♥) and it lands here.</p>
        </div>
      ) : (
        <div className="saved__list">
          {plans.map((p) => (
            <section key={p.id} className="saved__item">
              <div className="saved__itemHead">
                <div>
                  <h3>{p.city}</h3>
                  <p className="muted">{prettyDate(p.date)}</p>
                </div>
                <div className="saved__itemActions">
                  <button className="btn btn--ghost" onClick={() => share(p)}>↗ Share</button>
                  <button className="btn btn--ghost btn--danger" onClick={() => onRemove(p.id)}>Remove</button>
                </div>
              </div>
              <div className="saved__experiences">
                {p.experiences.map((x) => (
                  <ExperienceItem key={x.id} exp={x} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
