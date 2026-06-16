import { CATEGORY_ORDER, CATEGORIES, SLOTS } from './categories.js'

// A small seeded PRNG so a given (city, date, seed) always rebuilds the same
// plan — and bumping the seed deterministically produces a fresh one.
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Each plan covers 3 or 4 categories; we vary both the count and which one
// gets dropped so successive plans feel distinct.
function chooseCategories(rand) {
  const wantFour = rand() > 0.45
  if (wantFour) return [...CATEGORY_ORDER]
  const dropIdx = Math.floor(rand() * CATEGORY_ORDER.length)
  return CATEGORY_ORDER.filter((_, i) => i !== dropIdx)
}

export function buildPlan(pool, { city, date, seed = 0 }) {
  const base = hashStr(`${city.toLowerCase()}|${date}`)
  const rand = mulberry32((base + seed * 0x9e3779b1) >>> 0)
  const cats = chooseCategories(rand)

  const experiences = cats
    .map((cat) => {
      const candidates = pool[cat] || []
      if (!candidates.length) return null
      const pick = candidates[Math.floor(rand() * candidates.length)]
      const slot = CATEGORIES[cat].slot
      return {
        ...pick,
        timeLabel: SLOTS[slot].label,
        time: pick.time || SLOTS[slot].time,
        slotOrder: SLOTS[slot].order,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.slotOrder - b.slotOrder)

  return {
    id: `plan-${base}-${seed}`,
    city,
    date,
    experiences,
    createdAt: Date.now(),
  }
}
