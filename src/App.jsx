import { useCallback, useEffect, useState } from 'react'
import SearchScreen from './components/SearchScreen.jsx'
import PlanDeck from './components/PlanDeck.jsx'
import SavedPlans from './components/SavedPlans.jsx'
import SharedPlanView from './components/SharedPlanView.jsx'
import Toast from './components/Toast.jsx'
import { loadSaved, savePlan, removePlan } from './lib/storage.js'
import { decodePlan } from './lib/share.js'

function readSharedFromHash() {
  const m = location.hash.match(/plan=([^&]+)/)
  return m ? decodePlan(decodeURIComponent(m[1])) : null
}

export default function App() {
  const [view, setView] = useState('search') // search | deck | saved | shared
  const [query, setQuery] = useState(null)
  const [saved, setSaved] = useState(() => loadSaved())
  const [shared, setShared] = useState(null)
  const [toast, setToast] = useState('')

  // A shared link wins on first load.
  useEffect(() => {
    const sp = readSharedFromHash()
    if (sp && sp.experiences?.length) {
      setShared(sp)
      setView('shared')
    }
  }, [])

  const showToast = useCallback((m) => setToast(m), [])

  const start = useCallback((q) => {
    setQuery(q)
    setView('deck')
    if (location.hash) {
      history.replaceState(null, '', location.pathname + location.search)
    }
  }, [])

  const handleSave = useCallback((plan) => setSaved(savePlan(plan)), [])
  const handleRemove = useCallback((id) => setSaved(removePlan(id)), [])

  return (
    <div className="app">
      {view === 'shared' && shared && (
        <SharedPlanView
          plan={shared}
          onStart={() => {
            setShared(null)
            setView('search')
          }}
        />
      )}

      {view === 'search' && (
        <SearchScreen
          initial={query}
          onStart={start}
          savedCount={saved.length}
          onViewSaved={() => setView('saved')}
        />
      )}

      {view === 'deck' && query && (
        <PlanDeck
          query={query}
          onSave={handleSave}
          onToast={showToast}
          onNewSearch={() => setView('search')}
          savedCount={saved.length}
          onViewSaved={() => setView('saved')}
        />
      )}

      {view === 'saved' && (
        <SavedPlans
          plans={saved}
          onRemove={handleRemove}
          onBack={() => setView(query ? 'deck' : 'search')}
          onToast={showToast}
        />
      )}

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  )
}
