import { useEffect, useRef, useState } from 'react'
import ExperienceItem from './ExperienceItem.jsx'
import { prettyDate } from '../lib/datetime.js'

const THRESHOLD = 110 // px the card must travel to count as a swipe

export default function PlanCard({ plan, onDecision, onShare }) {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [exit, setExit] = useState(null) // 'left' | 'right' while flying off
  const startX = useRef(0)

  // Keyboard: ← skip / regenerate, → save. (Bored-at-the-desk crowd.)
  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowLeft') decide('left')
      else if (e.key === 'ArrowRight') decide('right')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exit])

  function decide(dir) {
    if (exit) return // already committed
    setExit(dir)
  }

  // Fire the parent callback only when the card's own transform transition ends.
  function handleTransitionEnd(e) {
    if (e.target === e.currentTarget && e.propertyName === 'transform' && exit) {
      onDecision(exit)
    }
  }

  function onPointerDown(e) {
    if (exit || e.target.closest('a, button')) return
    setDragging(true)
    startX.current = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e) {
    if (dragging) setDx(e.clientX - startX.current)
  }
  function onPointerEnd() {
    if (!dragging) return
    setDragging(false)
    if (dx > THRESHOLD) decide('right')
    else if (dx < -THRESHOLD) decide('left')
    else setDx(0)
  }

  const rot = Math.max(-14, Math.min(14, dx / 12))
  const saveOpacity = Math.max(0, Math.min(1, dx / THRESHOLD))
  const skipOpacity = Math.max(0, Math.min(1, -dx / THRESHOLD))

  let transform
  let transition
  if (exit === 'right') {
    transform = 'translateX(140%) rotate(16deg)'
    transition = 'transform .35s ease-in'
  } else if (exit === 'left') {
    transform = 'translateX(-140%) rotate(-16deg)'
    transition = 'transform .35s ease-in'
  } else {
    transform = `translateX(${dx}px) rotate(${rot}deg)`
    transition = dragging ? 'none' : 'transform .3s cubic-bezier(.2,.8,.2,1)'
  }

  const hasLive = plan.experiences.some((x) => x.source === 'live')

  return (
    <article
      className="plan-card"
      style={{ transform, transition }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="stamp stamp--save" style={{ opacity: saveOpacity }}>SAVE</div>
      <div className="stamp stamp--skip" style={{ opacity: skipOpacity }}>SKIP</div>

      <header className="plan-card__head">
        <div>
          <h2>{plan.city}</h2>
          <p className="muted">{prettyDate(plan.date)}</p>
        </div>
        <span className={`source-badge ${hasLive ? 'is-live' : 'is-demo'}`}>
          {hasLive ? '● Live' : 'Demo'}
        </span>
      </header>

      <div className="plan-card__list">
        {plan.experiences.map((x) => (
          <ExperienceItem key={x.id} exp={x} />
        ))}
      </div>

      <footer className="plan-card__actions">
        <button className="round round--skip" onClick={() => decide('left')} aria-label="Skip — generate a new plan">✕</button>
        <button className="round round--share" onClick={onShare} aria-label="Share this plan">↗</button>
        <button className="round round--save" onClick={() => decide('right')} aria-label="Save this plan">♥</button>
      </footer>
    </article>
  )
}
