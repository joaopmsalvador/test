import { useCallback, useEffect, useRef, useState } from 'react'
import PlanCard from './PlanCard.jsx'
import { getExperiencePool } from '../services/eventsService.js'
import { buildPlan } from '../lib/planBuilder.js'
import { sharePlan } from '../lib/share.js'

export default function PlanDeck({ query, onSave, onToast, onNewSearch, savedCount, onViewSaved }) {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [plan, setPlan] = useState(null)
  const poolRef = useRef(null)
  const seedRef = useRef(0)

  useEffect(() => {
    let alive = true
    setStatus('loading')
    seedRef.current = 0
    getExperiencePool(query.city, query.date)
      .then(({ pool }) => {
        if (!alive) return
        poolRef.current = pool
        setPlan(buildPlan(pool, { city: query.city, date: query.date, seed: 0 }))
        setStatus('ready')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [query.city, query.date])

  const nextPlan = useCallback(() => {
    seedRef.current += 1
    setPlan(buildPlan(poolRef.current, { city: query.city, date: query.date, seed: seedRef.current }))
  }, [query.city, query.date])

  const handleDecision = useCallback(
    (dir) => {
      if (dir === 'right') {
        onSave(plan)
        onToast('Saved to your day plans ♥')
      }
      nextPlan()
    },
    [plan, onSave, onToast, nextPlan],
  )

  const handleShare = useCallback(async () => {
    const res = await sharePlan(plan)
    if (res.ok && res.method === 'clipboard') onToast('Shareable link copied ✦')
    else if (!res.ok && res.method === 'none') onToast('Could not share — try again')
  }, [plan, onToast])

  return (
    <div className="screen deck">
      <nav className="deck__nav">
        <button className="link-btn" onClick={onNewSearch}>← New search</button>
        <div className="deck__where">
          <strong>{query.city}</strong>
        </div>
        <button className="link-btn" onClick={onViewSaved}>♥ Saved {savedCount > 0 ? `(${savedCount})` : ''}</button>
      </nav>

      <div className="deck__stage">
        {status === 'loading' && (
          <div className="deck__msg">
            <div className="spinner" />
            <p>Dreaming up your day in {query.city}…</p>
          </div>
        )}
        {status === 'error' && (
          <div className="deck__msg">
            <p>Something went wrong building your day.</p>
            <button className="btn btn--primary" onClick={onNewSearch}>Try again</button>
          </div>
        )}
        {status === 'ready' && plan && (
          <PlanCard key={plan.id} plan={plan} onDecision={handleDecision} onShare={handleShare} />
        )}
      </div>

      {status === 'ready' && (
        <p className="deck__hint">
          Drag the card, use <kbd>←</kbd> <kbd>→</kbd>, or the buttons · left to reshuffle, right to save
        </p>
      )}
    </div>
  )
}
