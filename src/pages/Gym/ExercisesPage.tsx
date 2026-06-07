import { useState, useEffect } from 'react'
import { api } from '../../api'
import PageMeta from "../../components/common/PageMeta"
import BodyDiagram from '../../components/BodyDiagram'
import { CATEGORY_TO_ALL_MUSCLE_IDS, MUSCLE_BY_ID } from '../../muscleData'

const CATEGORY_ICONS: Record<string, string> = {
  'Dada': '💪',
  'Punggung': '🔙',
  'Kaki': '🦵',
  'Bahu': '🏋️',
  'Biceps': '💪',
  'Triceps': '💪',
  'Perut': '🧠',
  'Lengan Bawah': '🤌',
  'Betis': '🦵',
  'Glutes': '🍑',
  'Full Body': '🧑',
  'Kardio': '🏃',
  'Calisthenics': '🤸',
  'Trap': '🔝',
  'Adductor/Abductor': '🦵',
  'Punggung Bawah': '🔙',
  'Lainnya': '📋',
}

const EQUIPMENT_OPTIONS = [
  'Barbel', 'Dumbbel', 'Kettlebell', 'Resistance Band',
  'Pull Up Bar', 'Bench', 'Cable Machine', 'Mesin Gym',
  'Matras', 'TRX', 'Medicine Ball', 'Jump Rope',
]

const CATEGORIES = ['Dada', 'Punggung', 'Kaki', 'Bahu', 'Biceps', 'Triceps', 'Lengan Bawah', 'Betis', 'Glutes', 'Perut', 'Full Body', 'Kardio', 'Calisthenics', 'Trap', 'Adductor/Abductor', 'Punggung Bawah', 'Lainnya']

function getHighlightMuscleIds(ex: any): string[] {
  if (ex.sub_muscles && ex.sub_muscles.length > 0) return ex.sub_muscles
  return CATEGORY_TO_ALL_MUSCLE_IDS[ex.category] || []
}

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0`
  }
  return null
}

function ExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedCat, setExpandedCat] = useState<string | null>(null)
  const [selectedExId, setSelectedExId] = useState<number | null>(null)
  // Add form
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Dada')
  const [tutorialUrl, setTutorialUrl] = useState('')
  const [exerciseEquipment, setExerciseEquipment] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  // Edit muscles modal
  const [editingEx, setEditingEx] = useState<any>(null)
  // Edit tutorial URL inline
  const [editingTutorialId, setEditingTutorialId] = useState<number | null>(null)
  const [editTutorialValue, setEditTutorialValue] = useState('')
  // Auto-fetch YouTube
  const [searchingVideo, setSearchingVideo] = useState(false)
  const [searchingVideoId, setSearchingVideoId] = useState<number | null>(null)

  const loadExercises = () => api.getExercises().then(data => {
    setExercises(data)
    setLoading(false)
  })

  useEffect(() => { loadExercises() }, [])

  const grouped = exercises.reduce((acc: Record<string, any[]>, ex: any) => {
    const cat = ex.category || 'Lainnya'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(ex)
    return acc
  }, {})

  const sortedCats = Object.keys(grouped).sort((a, b) => {
    const ia = CATEGORIES.indexOf(a)
    const ib = CATEGORIES.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true); setError('')
    try {
      await api.createExercise({ name: name.trim(), category, gif_url: tutorialUrl.trim() || undefined, equipment: exerciseEquipment || undefined })
      setName(''); setTutorialUrl(''); setExerciseEquipment('')
      loadExercises()
    } catch (err: any) { setError(err.message) }
    finally { setAdding(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus gerakan ini?')) return
    try { await api.deleteExercise(id); loadExercises() }
    catch {}
  }

  const handleAutoFetch = async (exName: string, onResult: (url: string) => void, setSearching: (v: boolean) => void) => {
    setSearching(true)
    try {
      const result = await api.autoFetchYoutube(exName)
      if (result.videoUrl) {
        onResult(result.videoUrl)
      } else {
        alert('Video tidak ditemukan untuk: ' + exName)
      }
    } catch { alert('Gagal mencari video') }
    finally { setSearching(false) }
  }

  const handleEditMuscles = (ex: any) => {
    const ids = ex.sub_muscles && ex.sub_muscles.length > 0
      ? [...ex.sub_muscles]
      : [...(CATEGORY_TO_ALL_MUSCLE_IDS[ex.category] || [])]
    setEditingEx({ ...ex, sub_muscles: ids })
  }

  const toggleMuscle = (id: string) => {
    setEditingEx((prev: any) => {
      const next = prev.sub_muscles.includes(id)
        ? prev.sub_muscles.filter((m: string) => m !== id)
        : [...prev.sub_muscles, id]
      return { ...prev, sub_muscles: next }
    })
  }

  const saveEditMuscles = async () => {
    if (!editingEx) return
    try {
      await api.updateExercise(editingEx.id, { sub_muscles: editingEx.sub_muscles })
      setEditingEx(null)
      loadExercises()
    } catch {}
  }

  const saveTutorialUrl = async (exId: number) => {
    try {
      await api.updateExercise(exId, { gif_url: editTutorialValue.trim() || '' })
      setEditingTutorialId(null)
      loadExercises()
    } catch {}
  }

  const filteredEx = (cat: string) => {
    if (!search) return grouped[cat] || []
    return (grouped[cat] || []).filter((ex: any) =>
      ex.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  const searchedCats = search
    ? sortedCats.filter(cat => filteredEx(cat).length > 0)
    : sortedCats

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  return (
    <>
      <PageMeta title="Latihan" description="Daftar gerakan latihan" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Latihan</h2>
          <input type="text" className="input input-sm w-48" placeholder="Cari latihan..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Add form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <form onSubmit={handleAdd} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Nama Gerakan</label>
              <input type="text" className="input w-full" placeholder="Contoh: Bench Press" value={name}
                onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Kategori</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Alat</label>
              <select className="input" value={exerciseEquipment} onChange={e => setExerciseEquipment(e.target.value)}>
                <option value="">Bodyweight</option>
                {EQUIPMENT_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">URL Tutorial YouTube</label>
              <div className="flex gap-1">
                <input type="text" className="input w-52" placeholder="https://youtube.com/watch?v=..." value={tutorialUrl}
                  onChange={e => setTutorialUrl(e.target.value)} />
                <button type="button" className="text-xs text-brand-500 hover:underline shrink-0" disabled={searchingVideo || !name.trim()}
                  onClick={() => handleAutoFetch(name.trim(), setTutorialUrl, setSearchingVideo)}>
                  {searchingVideo ? '...' : 'Cari'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={adding || !name.trim()}>
              {adding ? '...' : 'Tambah'}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Category table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] divide-y divide-gray-100 dark:divide-gray-800">
          {searchedCats.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">Tidak ada latihan ditemukan</div>
          ) : (
            searchedCats.map(cat => {
              const exs = filteredEx(cat)
              const isOpen = expandedCat === cat
              return (
                <div key={cat}>
                  {/* Category row */}
                  <button
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    onClick={() => setExpandedCat(isOpen ? null : cat)}>
                    <span className="text-lg">{CATEGORY_ICONS[cat] || '📋'}</span>
                    <span className="font-medium text-sm flex-1">{cat}</span>
                    <span className="text-xs text-gray-400">{exs.length} latihan</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded exercises */}
                  {isOpen && (
                    <div className="border-t border-gray-100 dark:border-gray-800">
                      {exs.map((ex: any) => {
                        const isSelected = selectedExId === ex.id
                        return (
                          <div key={ex.id}>
                            {/* Exercise row */}
                            <button
                              className="w-full flex items-center gap-3 px-5 py-2.5 pl-14 text-sm border-b border-gray-50 dark:border-gray-800/50 last:border-0 text-left transition hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"
                              onClick={() => setSelectedExId(isSelected ? null : ex.id)}>
                              <span className="flex-1 font-medium">{ex.name}</span>
                              {ex.gif_url && getYouTubeEmbedUrl(ex.gif_url) && <span className="text-xs text-brand-500" title="YouTube">▶</span>}
                              {ex.equipment ? <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{ex.equipment}</span> : <span className="text-xs text-gray-400">Bodyweight</span>}
                              <span className="text-xs text-gray-400">{ex.category}</span>
                              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {/* Exercise detail */}
                            {isSelected && (
                              <div className="px-5 py-3 pl-14 bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-50 dark:border-gray-800/50">
                                <div className="flex gap-6">
                                  <div className="flex-1 space-y-2">
                                    <div>
                                      <span className="text-xs text-gray-400">Bagian tubuh: </span>
                                      <span className="text-sm font-medium">{ex.category}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-400">Alat: </span>
                                      <span className="text-sm font-medium">{ex.equipment || 'Bodyweight'}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-400">Otot target: </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {getHighlightMuscleIds(ex).length > 0
                                          ? getHighlightMuscleIds(ex).map((id: string) => {
                                              const def = MUSCLE_BY_ID[id]
                                              return def
                                                ? <span key={id} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{def.label}</span>
                                                : <span key={id} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{id}</span>
                                            })
                                          : <span className="text-xs text-gray-400 italic">Semua {ex.category}</span>
                                        }
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                      <button type="button" className="text-xs text-brand-500 hover:underline"
                                        onClick={() => handleEditMuscles(ex)}>
                                        Edit target otot
                                      </button>
                                      {editingTutorialId === ex.id ? (
                                        <div className="flex items-center gap-1">
                                          <input type="text" className="input input-xs w-56"
                                            value={editTutorialValue}
                                            onChange={e => setEditTutorialValue(e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..." />
                                          <button className="text-xs text-green-600 hover:underline"
                                            onClick={() => saveTutorialUrl(ex.id)}>Simpan</button>
                                          <button className="text-xs text-gray-400 hover:underline"
                                            onClick={() => setEditingTutorialId(null)}>Batal</button>
                                        </div>
                                      ) : (
                                        <>
                                          <button type="button" className="text-xs text-brand-500 hover:underline"
                                            onClick={() => { setEditingTutorialId(ex.id); setEditTutorialValue(ex.gif_url || '') }}>
                                            {ex.gif_url ? 'Ganti' : 'Tambah'} Video
                                          </button>
                                          {!ex.gif_url && (
                                            <button type="button" className="text-xs text-brand-500 hover:underline" disabled={searchingVideoId === ex.id}
                                              onClick={() => handleAutoFetch(ex.name, (url) => { setEditTutorialValue(url); api.updateExercise(ex.id, { gif_url: url }).then(loadExercises) }, setSearchingVideoId)}>
                                              {searchingVideoId === ex.id ? '...' : 'Cari Video'}
                                            </button>
                                          )}
                                        </>
                                      )}
                                      {ex.gif_url && editingTutorialId !== ex.id && (
                                        <button type="button" className="text-xs text-red-400 hover:underline"
                                          onClick={async () => { await api.updateExercise(ex.id, { gif_url: '' }); loadExercises() }}>
                                          Hapus
                                        </button>
                                      )}
                                    </div>

                                    {/* YouTube embed */}
                                    {ex.gif_url && (() => {
                                      const yt = getYouTubeEmbedUrl(ex.gif_url)
                                      return yt ? (
                                        <div className="mt-2">
                                          <div className="w-full max-w-[320px] aspect-video rounded-lg overflow-hidden">
                                            <iframe src={yt} className="w-full h-full" allowFullScreen title={ex.name} />
                                          </div>
                                        </div>
                                      ) : null
                                    })()}
                                  </div>
                                  <div className="shrink-0">
                                    <BodyDiagram muscleIds={getHighlightMuscleIds(ex)} size={120} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Edit muscles modal */}
      {editingEx && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={() => setEditingEx(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Edit target otot: {editingEx.name}</h3>
                <button onClick={() => setEditingEx(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="space-y-3">
                {Object.entries(
                  (CATEGORY_TO_ALL_MUSCLE_IDS[editingEx.category] || []).reduce((acc: Record<string, string[]>, id: string) => {
                    const def = MUSCLE_BY_ID[id]
                    if (!def) return acc
                    if (!acc[def.group]) acc[def.group] = []
                    acc[def.group].push(id)
                    return acc
                  }, {})
                ).map(([group, ids]) => (
                  <div key={group}>
                    <div className="text-xs font-medium text-gray-500 mb-1">{group}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {ids.map((id: string) => {
                        const def = MUSCLE_BY_ID[id]
                        if (!def) return null
                        const active = editingEx.sub_muscles.includes(id)
                        return (
                          <button key={id} type="button"
                            className={`text-xs px-2.5 py-1 rounded-full border transition ${
                              active
                                ? 'bg-brand-500 text-white border-brand-500'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-500'
                            }`}
                            onClick={() => toggleMuscle(id)}>
                            {def.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditingEx(null)}>Batal</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={saveEditMuscles}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ExercisesPage
