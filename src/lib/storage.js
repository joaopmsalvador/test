// Saved day plans live in localStorage so they survive reloads without a backend.

const KEY = 'whimsy.savedPlans.v1'

export function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function saveAll(plans) {
  try {
    localStorage.setItem(KEY, JSON.stringify(plans))
  } catch {
    /* ignore quota errors / private-mode restrictions */
  }
}

export function savePlan(plan) {
  const plans = loadSaved()
  if (plans.some((p) => p.id === plan.id)) return plans // already saved
  const next = [{ ...plan, savedAt: Date.now() }, ...plans]
  saveAll(next)
  return next
}

export function removePlan(id) {
  const next = loadSaved().filter((p) => p.id !== id)
  saveAll(next)
  return next
}
