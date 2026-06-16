import { CATEGORY_ORDER } from '../lib/categories.js'
import { fetchTicketmaster, tmEnabled } from './ticketmaster.js'
import { localCandidates } from './localEvents.js'

// One fetch per (city, date) builds a pool of candidate experiences grouped by
// category. Plans are then assembled from this pool client-side, so swiping to
// regenerate is instant and doesn't burn API quota. Results are memoized.
const cache = new Map()

export async function getExperiencePool(city, date) {
  const key = `${city.toLowerCase().trim()}|${date}`
  if (cache.has(key)) return cache.get(key)

  const entries = await Promise.all(
    CATEGORY_ORDER.map(async (cat) => {
      const live = tmEnabled() ? await fetchTicketmaster(cat, city, date) : null
      // Live events first, then padded with demo options so every category
      // always has enough to keep regeneration varied.
      const candidates = [...(live || []), ...localCandidates(cat, city)]
      return [cat, candidates]
    }),
  )

  const pool = {}
  let liveCount = 0
  for (const [cat, candidates] of entries) {
    pool[cat] = candidates
    liveCount += candidates.filter((c) => c.source === 'live').length
  }

  const source = !tmEnabled() ? 'demo' : liveCount > 0 ? 'mixed' : 'demo'
  const result = { pool, source, liveCount }
  cache.set(key, result)
  return result
}

export function clearPoolCache() {
  cache.clear()
}
