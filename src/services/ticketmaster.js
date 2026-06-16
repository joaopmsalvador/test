import { dayWindowUTC } from '../lib/datetime.js'

// Live calls only happen when a key has been wired up (see .env.example).
// We read a plain VITE_ flag the client can see; the actual key stays
// server-side in the Vite proxy.
const ENABLED = import.meta.env.VITE_TM_ENABLED === 'true'

// Map our four categories onto Ticketmaster Discovery classifications.
const QUERY_BY_CATEGORY = {
  music: { classificationName: 'Music' },
  cultural: { classificationName: 'Arts & Theatre' },
  physical: { classificationName: 'Sports' },
  gastronomic: { keyword: 'food' },
}

export function tmEnabled() {
  return ENABLED
}

// Returns an array of normalized experiences, or null if live data is off /
// unavailable so the caller can fall back to the demo dataset.
export async function fetchTicketmaster(category, city, date, { size = 15 } = {}) {
  if (!ENABLED) return null
  const q = QUERY_BY_CATEGORY[category]
  if (!q) return null

  const { startDateTime, endDateTime } = dayWindowUTC(date)
  const params = new URLSearchParams({
    city,
    startDateTime,
    endDateTime,
    size: String(size),
    sort: 'date,asc',
    ...q,
  })

  try {
    const res = await fetch(`/tm/events.json?${params.toString()}`)
    if (!res.ok) return null
    const json = await res.json()
    const events = json?._embedded?.events || []
    return events.map((ev) => normalize(ev, category))
  } catch {
    // No proxy (production build), network blocked, or CORS — fall back.
    return null
  }
}

function normalize(ev, category) {
  const venue = ev?._embedded?.venues?.[0]
  const localTime = ev?.dates?.start?.localTime
  return {
    id: `tm-${ev.id}`,
    title: ev.name,
    category,
    venue: venue?.name || venue?.city?.name || '',
    description: ev?.info || ev?.pleaseNote || '',
    time: localTime ? localTime.slice(0, 5) : null,
    url: ev.url || '',
    imageUrl: pickImage(ev?.images),
    price: priceText(ev?.priceRanges),
    source: 'live',
  }
}

function pickImage(images) {
  if (!Array.isArray(images) || !images.length) return ''
  const wide = images.find((i) => i.ratio === '16_9' && i.width >= 640)
  return (wide || images[0]).url
}

function priceText(ranges) {
  if (!Array.isArray(ranges) || !ranges.length || ranges[0].min == null) return ''
  const { min, max, currency = '' } = ranges[0]
  return min === max ? `${min} ${currency}`.trim() : `${min}–${max} ${currency}`.trim()
}
