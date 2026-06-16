// The four experience categories the app plans around, plus the time-of-day
// slot each one tends to occupy so a day reads chronologically.

export const CATEGORIES = {
  physical: {
    id: 'physical',
    label: 'Move',
    fullLabel: 'Physical',
    emoji: '🏃',
    color: '#34d399',
    slot: 'morning',
  },
  cultural: {
    id: 'cultural',
    label: 'Culture',
    fullLabel: 'Cultural',
    emoji: '🎭',
    color: '#a78bfa',
    slot: 'afternoon',
  },
  gastronomic: {
    id: 'gastronomic',
    label: 'Taste',
    fullLabel: 'Gastronomic',
    emoji: '🍽️',
    color: '#fb923c',
    slot: 'evening',
  },
  music: {
    id: 'music',
    label: 'Music',
    fullLabel: 'Music',
    emoji: '🎵',
    color: '#f472b6',
    slot: 'night',
  },
}

export const CATEGORY_ORDER = ['physical', 'cultural', 'gastronomic', 'music']

export const SLOTS = {
  morning: { label: 'Morning', time: '09:30', order: 0 },
  afternoon: { label: 'Afternoon', time: '14:00', order: 1 },
  evening: { label: 'Evening', time: '19:30', order: 2 },
  night: { label: 'Night', time: '22:00', order: 3 },
}

export function categoryOf(id) {
  return CATEGORIES[id] || CATEGORIES.cultural
}
