// City-agnostic experience templates used whenever live data is unavailable
// (no API key, no network, or a category returns nothing). Venue names are
// personalized with the chosen city so plans still feel local. The variety
// here is what makes "swipe to regenerate" feel fresh.

const TEMPLATES = {
  physical: [
    { title: 'Sunrise run along the waterfront', venue: '{city} Riverside Path', desc: 'Beat the crowds with an easy 5K as the city wakes up.', price: 'Free' },
    { title: 'Drop-in vinyasa yoga', venue: 'Lotus Studio {city}', desc: 'A 60-minute all-levels flow to shake off the screen fatigue.', price: '€12' },
    { title: 'Indoor bouldering session', venue: '{city} Climbing Co.', desc: 'Problem-solve your way up the walls — gear rental included.', price: '€18' },
    { title: 'City bike tour of the old town', venue: 'Pedal {city}', desc: 'Cover the landmarks on two wheels with a local guide.', price: '€25' },
    { title: 'Lunchtime lap swim', venue: '{city} Municipal Baths', desc: 'Clear your head with a few quiet lengths.', price: '€6' },
    { title: 'Open-air bootcamp circuit', venue: 'Central Park, {city}', desc: 'Kettlebells, intervals and fresh air with a friendly crew.', price: '€10' },
    { title: 'Sunset stand-up paddleboard', venue: '{city} Marina', desc: 'Glide across calm water as the light goes golden.', price: '€30' },
    { title: 'Trail walk to the viewpoint', venue: '{city} Hills', desc: 'A breezy hike rewarded with the best skyline in town.', price: 'Free' },
    { title: 'Squash court hire & drills', venue: '{city} Racket Club', desc: 'Burn off the afternoon with a fast-paced hit.', price: '€14' },
    { title: 'Riverside skate session', venue: '{city} Skate Plaza', desc: 'Cruise the smooth ledges and ramps by the water.', price: 'Free' },
    { title: 'Climbing-gym + sauna combo', venue: 'Ascend {city}', desc: 'Earn the heat: an hour on the wall, then unwind.', price: '€22' },
  ],
  cultural: [
    { title: 'Contemporary art exhibition', venue: '{city} Museum of Modern Art', desc: 'A rotating show of bold new work — grab the audio guide.', price: '€14' },
    { title: 'Hidden courtyards walking tour', venue: 'Meet at {city} Old Square', desc: 'A storyteller guide unlocks the city behind its facades.', price: '€18' },
    { title: 'Matinee at the independent cinema', venue: 'The Roxy, {city}', desc: 'A restored classic on the big screen with a craft soda.', price: '€11' },
    { title: 'Evening at the playhouse', venue: '{city} Playhouse', desc: 'A new production drawing great word of mouth.', price: '€32' },
    { title: 'Photography gallery opening', venue: 'Frame Gallery {city}', desc: 'Wander a free opening with a glass in hand.', price: 'Free' },
    { title: 'History museum late opening', venue: '{city} City Museum', desc: 'Quieter halls and a special after-hours route.', price: '€10' },
    { title: 'Spoken-word & poetry night', venue: 'The Reading Room, {city}', desc: 'Local voices, open mic, surprisingly moving.', price: '€8' },
    { title: 'Architecture rooftop tour', venue: '{city} Design Center', desc: 'Climb up for the stories behind the skyline.', price: '€20' },
    { title: 'Artisan screen-print workshop', venue: 'Inkhouse {city}', desc: 'Make your own print to take home.', price: '€28' },
    { title: 'Botanical glasshouse stroll', venue: '{city} Botanic Gardens', desc: 'A calm wander through palms and orchids.', price: '€7' },
  ],
  gastronomic: [
    { title: 'Street-food market crawl', venue: '{city} Night Market', desc: 'Graze a dozen stalls — go hungry, share everything.', price: '€20' },
    { title: 'Natural wine & small plates', venue: 'Carafe, {city}', desc: 'A buzzy little bar with a chalkboard that changes daily.', price: '€35' },
    { title: "Chef's-counter tasting menu", venue: 'Ember {city}', desc: 'Seven courses, open kitchen, a front-row seat.', price: '€75' },
    { title: 'Specialty coffee & pastry flight', venue: 'Roast House {city}', desc: 'Single-origin pours with a tray of morning bakes.', price: '€12' },
    { title: 'Hands-on pasta class + dinner', venue: 'La Cucina {city}', desc: 'Roll it, sauce it, eat it. Wine included.', price: '€55' },
    { title: 'Rooftop cocktails at golden hour', venue: 'Sky Bar {city}', desc: 'Signature drinks with the whole city below.', price: '€16' },
    { title: 'Old-town tapas trail', venue: 'Barrio {city}', desc: 'Three bars, three bites, one great evening.', price: '€30' },
    { title: 'Farmers-market brunch', venue: '{city} Market Hall', desc: 'Seasonal plates from the people who grew it.', price: '€18' },
    { title: 'Dumpling-house feast', venue: 'Steam {city}', desc: 'Baskets keep coming until you say stop.', price: '€22' },
    { title: 'Dessert tasting flight', venue: 'Sweet Lab {city}', desc: 'Five tiny puddings and a very good espresso.', price: '€14' },
  ],
  music: [
    { title: 'Live jazz in a basement club', venue: 'Blue Note {city}', desc: 'Late sets, low light, a trio that really cooks.', price: '€20' },
    { title: 'Indie band at the music hall', venue: '{city} Music Hall', desc: 'A rising act on tour — get there early for the support.', price: '€28' },
    { title: 'Vinyl listening bar', venue: 'Groove {city}', desc: 'No talking over the records. Just very good sound.', price: '€10' },
    { title: 'Open-air DJ sundowner', venue: '{city} Terrace', desc: 'House and disco as the sun drops. Dancing optional.', price: '€15' },
    { title: 'Acoustic singer-songwriter night', venue: 'The Snug, {city}', desc: 'Stripped-back sets in a room that actually listens.', price: '€12' },
    { title: 'Symphony at the concert hall', venue: '{city} Concert Hall', desc: 'A goosebumps program — dress up a little.', price: '€40' },
    { title: 'Late-night warehouse party', venue: 'Depot {city}', desc: 'Big room, bigger system, on till sunrise.', price: '€22' },
    { title: 'Trad session in an old pub', venue: 'The Harp, {city}', desc: 'Fiddles, pints, and not a setlist in sight.', price: 'Free' },
    { title: 'Soul & funk dance night', venue: 'Motown Room {city}', desc: 'All killer, no filler. Bring dancing shoes.', price: '€14' },
    { title: 'Rooftop string-quartet sunset', venue: '{city} Rooftop', desc: 'Classical favourites and a view to match.', price: '€26' },
  ],
}

export function localCandidates(category, city) {
  const list = TEMPLATES[category] || []
  return list.map((t, i) => ({
    id: `local-${category}-${i}`,
    title: t.title,
    category,
    venue: (t.venue || '').replaceAll('{city}', city),
    description: t.desc,
    time: null,
    url: '',
    imageUrl: '',
    price: t.price || '',
    source: 'demo',
  }))
}
