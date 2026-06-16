import { useState } from 'react'
import { todayISO } from '../lib/datetime.js'

const SUGGESTIONS = ['Lisbon', 'Barcelona', 'Berlin', 'London', 'Paris', 'New York', 'Tokyo', 'Amsterdam']

export default function SearchScreen({ initial, onStart, savedCount, onViewSaved }) {
  const [city, setCity] = useState(initial?.city || '')
  const [date, setDate] = useState(initial?.date || todayISO())

  function submit(e) {
    e.preventDefault()
    const trimmed = city.trim()
    if (trimmed) onStart({ city: trimmed, date })
  }

  return (
    <div className="screen search">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">✦</span>
        <h1>Whimsy</h1>
      </div>
      <p className="tagline">
        Bored at your desk? Tell us where and when — we&apos;ll build you a day worth leaving the house for.
      </p>

      <form className="search__form" onSubmit={submit}>
        <label className="field">
          <span>City</span>
          <input
            type="text"
            value={city}
            placeholder="e.g. Lisbon"
            onChange={(e) => setCity(e.target.value)}
            autoFocus
          />
        </label>
        <label className="field">
          <span>Date</span>
          <input type="date" value={date} min={todayISO()} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button className="btn btn--primary" type="submit" disabled={!city.trim()}>
          Build my day →
        </button>
      </form>

      <div className="chips" role="group" aria-label="Popular cities">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="chip" onClick={() => setCity(s)}>
            {s}
          </button>
        ))}
      </div>

      {savedCount > 0 && (
        <button className="link-btn link-btn--center" onClick={onViewSaved}>
          ♥ View saved plans ({savedCount})
        </button>
      )}
    </div>
  )
}
