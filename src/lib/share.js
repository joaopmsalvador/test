import { prettyDate } from './datetime.js'
import { categoryOf } from './categories.js'

// Unicode-safe base64 so titles with accents/emoji survive the round trip.
const encodeB64 = (str) => btoa(unescape(encodeURIComponent(str)))
const decodeB64 = (b64) => decodeURIComponent(escape(atob(b64)))

// A plan is packed into a short URL hash so a shared link reconstructs the
// exact day — no backend required.
export function encodePlan(plan) {
  const slim = {
    c: plan.city,
    d: plan.date,
    e: plan.experiences.map((x) => ({
      t: x.title,
      k: x.category,
      v: x.venue,
      l: x.timeLabel,
      u: x.url || '',
      s: x.source || 'demo',
    })),
  }
  return encodeB64(JSON.stringify(slim))
}

export function decodePlan(data) {
  try {
    const slim = JSON.parse(decodeB64(data))
    return {
      id: 'shared',
      shared: true,
      city: slim.c,
      date: slim.d,
      experiences: (slim.e || []).map((x, i) => ({
        id: `shared-${i}`,
        title: x.t,
        category: x.k,
        venue: x.v,
        timeLabel: x.l,
        url: x.u,
        source: x.s,
      })),
    }
  } catch {
    return null
  }
}

export function planShareURL(plan) {
  const base = `${location.origin}${location.pathname}`
  return `${base}#plan=${encodePlan(plan)}`
}

export function planShareText(plan) {
  const lines = plan.experiences.map((x) => {
    const c = categoryOf(x.category)
    return `${c.emoji} ${x.timeLabel} — ${x.title}${x.venue ? ` @ ${x.venue}` : ''}`
  })
  return `My day in ${plan.city} · ${prettyDate(plan.date)}\n\n${lines.join('\n')}\n\nPlanned with Whimsy ✦`
}

// Uses the native share sheet when available, otherwise copies to clipboard.
export async function sharePlan(plan) {
  const url = planShareURL(plan)
  const text = planShareText(plan)
  const title = `A day in ${plan.city}`

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return { ok: true, method: 'share' }
    } catch (err) {
      if (err && err.name === 'AbortError') return { ok: false, method: 'abort' }
      // otherwise fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`)
    return { ok: true, method: 'clipboard' }
  } catch {
    return { ok: false, method: 'none', url, text }
  }
}
