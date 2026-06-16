export function todayISO() {
  return toISODate(new Date())
}

export function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function prettyDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

// Ticketmaster expects a UTC ISO-8601 window, e.g. 2026-06-16T00:00:00Z.
export function dayWindowUTC(iso) {
  const start = new Date(`${iso}T00:00:00`)
  const end = new Date(`${iso}T23:59:59`)
  const fmt = (d) => d.toISOString().replace(/\.\d{3}Z$/, 'Z')
  return { startDateTime: fmt(start), endDateTime: fmt(end) }
}
