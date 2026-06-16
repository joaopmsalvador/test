# ✦ Whimsy

**Bored at your desk? Whimsy turns a city + a date into a swipeable day plan of
things to do.**

Pick a **city** and a **date**, and Whimsy builds you a day made of **3–4
experiences** across four flavours — 🏃 physical, 🎭 cultural, 🍽️ gastronomic
and 🎵 music — laid out from morning to night. Don't like it? **Swipe left** (or
press ←) to reshuffle a brand-new day. Love it? **Swipe right** (→) to save it.
Then **share** the whole plan with a single tap.

---

## Features

- **Two inputs, one great day** — just a city and a date.
- **Curated day plans** — 3 or 4 experiences spanning exercise, culture, food
  and music, ordered chronologically (morning → night).
- **Tinder-style deck** — drag the card, use the ← / → arrow keys, or tap the
  on-screen buttons. Left reshuffles, right saves.
- **Save & revisit** — saved days persist in your browser (localStorage).
- **Share** — uses the native share sheet on mobile, copies a link on desktop.
  The link encodes the whole plan, so whoever opens it sees the exact day — no
  backend required.
- **Real event data (optional)** — wires up to the Ticketmaster Discovery API
  when you provide a key; otherwise runs on a rich built-in demo dataset.

## Quick start

```bash
npm install
npm run dev          # open the printed http://localhost:5173
```

That's it — the app runs immediately on the demo dataset. No key needed.

```bash
npm run build        # production build into dist/
npm run preview      # serve the production build locally
```

## Enabling live events (Ticketmaster)

1. Grab a free key at <https://developer.ticketmaster.com>.
2. Copy `.env.example` to `.env` and fill it in:
   ```env
   TICKETMASTER_API_KEY=your_key_here
   VITE_TM_ENABLED=true
   ```
3. Restart `npm run dev`.

Now Music / Arts & Theatre / Sports slots are filled with **real events** for
your city and date (shown with a green **live** badge), and any gaps are
topped up from the demo dataset so every day still feels full.

> **How the key stays safe:** the browser never sees it. The client calls a
> relative `/tm/...` path; the Vite dev server proxies that to Ticketmaster and
> injects the key server-side (see `vite.config.js`). This also sidesteps the
> API's CORS restrictions. For a production deployment you'd put the same tiny
> proxy in a serverless function — until then the app gracefully falls back to
> demo data when no proxy is present.

## How it works

```
City + Date
   │
   ▼
eventsService.getExperiencePool()      ← fetches once per (city, date), memoized
   ├── ticketmaster.js   (live events, if a key is configured)
   └── localEvents.js    (curated, city-personalized demo templates)
   │
   ▼
planBuilder.buildPlan(pool, { seed })  ← seeded PRNG picks 3–4 categories + items
   │                                     bump the seed → a fresh, deterministic day
   ▼
PlanDeck → PlanCard                    ← swipe/keys/buttons drive save vs. reshuffle
```

The candidate pool is fetched **once** per city/date and cached, so swiping to
regenerate is instant and never burns API quota. A seeded PRNG keyed on
`(city, date, seed)` makes each reshuffle deterministic yet distinct.

## Project structure

```
src/
├── main.jsx                 app entry
├── App.jsx                  view router: search · deck · saved · shared
├── index.css                theme + all styles (no CSS framework)
├── components/
│   ├── SearchScreen.jsx     city + date inputs, city suggestions
│   ├── PlanDeck.jsx         loads the pool, drives the deck
│   ├── PlanCard.jsx         the swipeable card (drag / keys / buttons)
│   ├── ExperienceItem.jsx   one experience row
│   ├── SavedPlans.jsx       saved-plans list
│   ├── SharedPlanView.jsx   read-only view of a shared link
│   └── Toast.jsx            transient notifications
├── services/
│   ├── eventsService.js     orchestrates providers → candidate pool
│   ├── ticketmaster.js      real Ticketmaster Discovery client
│   └── localEvents.js       curated demo dataset
└── lib/
    ├── categories.js        the 4 categories + time-of-day slots
    ├── planBuilder.js       seeded day assembly
    ├── storage.js           localStorage for saved plans
    ├── share.js             plan ↔ URL encoding, native share / clipboard
    └── datetime.js          date helpers
```

## Tech

React 18 + Vite. No UI framework, no state library — just React state and a
handful of small, focused modules. Swipe gestures use native Pointer Events
(so mouse drag, touch and trackpad all work).

## Ideas for next

- Geocode the city + map view of the day.
- More live providers behind the same interface (Yelp/Foursquare for food,
  OpenStreetMap for free outdoor activities).
- "Surprise me" that also randomizes the city.
- Account sync so saved plans follow you across devices.
