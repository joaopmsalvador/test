import { categoryOf } from '../lib/categories.js'

export default function ExperienceItem({ exp }) {
  const cat = categoryOf(exp.category)
  return (
    <div className="exp" style={{ '--cat': cat.color }}>
      <div className="exp__time">
        <span className="exp__emoji" aria-hidden="true">{cat.emoji}</span>
        <span className="exp__slot">{exp.timeLabel}</span>
        {exp.time && <span className="exp__clock">{exp.time}</span>}
      </div>

      <div className="exp__body">
        <div className="exp__titleRow">
          <h3 className="exp__title">{exp.title}</h3>
          {exp.source === 'live' && (
            <span className="exp__live" title="Live event from Ticketmaster">live</span>
          )}
        </div>
        {exp.venue && <p className="exp__venue">{exp.venue}</p>}
        {exp.description && <p className="exp__desc">{exp.description}</p>}
        <div className="exp__meta">
          <span className="exp__tag">{cat.fullLabel}</span>
          {exp.price && <span className="exp__price">{exp.price}</span>}
          {exp.url && (
            <a className="exp__link" href={exp.url} target="_blank" rel="noreferrer">
              Details ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
