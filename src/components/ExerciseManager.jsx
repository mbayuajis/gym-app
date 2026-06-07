import { useState } from 'react'
import { api } from '../api'
import BodyDiagram from './BodyDiagram'
import { CATEGORY_TO_ALL_MUSCLE_IDS, getCategoryMuscleIds, MUSCLE_BY_ID, MUSCLE_GROUPS } from '../muscleData'

const CATEGORIES = [
  'Dada', 'Punggung', 'Kaki', 'Bahu', 'Biceps', 'Triceps',
  'Lengan Bawah', 'Betis', 'Glutes', 'Perut', 'Full Body',
  'Kardio', 'Calisthenics', 'Lainnya'
]

function MuscleSelector({ category, selected, onChange }) {
  const muscleIds = CATEGORY_TO_ALL_MUSCLE_IDS[category]
  if (!muscleIds || muscleIds.length === 0) return null

  const grouped = {}
  for (const id of muscleIds) {
    const def = MUSCLE_BY_ID[id]
    if (!def) continue
    if (!grouped[def.group]) grouped[def.group] = []
    grouped[def.group].push(id)
  }

  return (
    <div className="muscle-selector">
      <label className="muscle-selector-label">Target otot spesifik (opsional):</label>
      <div className="muscle-selector-grid">
        {Object.entries(grouped).map(([groupName, ids]) => (
          <div key={groupName} className="muscle-group">
            <div className="muscle-group-name">{groupName}</div>
            <div className="muscle-group-chips">
              {ids.map(id => {
                const def = MUSCLE_BY_ID[id]
                const active = selected.has(id)
                return (
                  <button
                    key={id}
                    type="button"
                    className={`muscle-chip ${active ? 'active' : ''}`}
                    onClick={() => {
                      const next = new Set(selected)
                      if (active) next.delete(id)
                      else next.add(id)
                      onChange(next)
                    }}
                    title={def.label}
                  >
                    {def.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExerciseManager({ exercises, onRefresh }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [selectedMuscles, setSelectedMuscles] = useState(new Set())
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedEx, setSelectedEx] = useState(null)
  const [editingMuscles, setEditingMuscles] = useState(null)

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    const defaults = CATEGORY_TO_ALL_MUSCLE_IDS[cat]
    if (defaults) setSelectedMuscles(new Set(defaults))
    else setSelectedMuscles(new Set())
  }

  const filtered = search
    ? exercises.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()))
    : exercises

  const filteredGrouped = filtered.reduce((acc, ex) => {
    const cat = ex.category || 'Lainnya'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(ex)
    return acc
  }, {})

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return

    setAdding(true)
    try {
      await api.createExercise({
        name: name.trim(),
        category,
        sub_muscles: [...selectedMuscles],
      })
      setName('')
      onRefresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus gerakan ini?')) return
    try {
      await api.deleteExercise(id)
      onRefresh()
    } catch {}
  }

  const handleEditMuscles = async (ex) => {
    const muscleIds = []
    if (ex.sub_muscles && ex.sub_muscles.length > 0) {
      muscleIds.push(...ex.sub_muscles)
    } else {
      const defaults = CATEGORY_TO_ALL_MUSCLE_IDS[ex.category]
      if (defaults) muscleIds.push(...defaults)
    }
    setEditingMuscles({ exercise: ex, selected: new Set(muscleIds) })
  }

  const saveEditMuscles = async () => {
    if (!editingMuscles) return
    try {
      await api.updateExercise(editingMuscles.exercise.id, {
        sub_muscles: [...editingMuscles.selected],
      })
      setEditingMuscles(null)
      onRefresh()
    } catch {}
  }

  const getHighlightMuscleIds = (ex) => {
    if (ex.sub_muscles && ex.sub_muscles.length > 0) return ex.sub_muscles
    return CATEGORY_TO_ALL_MUSCLE_IDS[ex.category] || []
  }

  return (
    <div className="card">
      <h2 className="card-title">Daftar Gerakan</h2>

      <form onSubmit={handleAdd} className="add-exercise-form">
        <input
          type="text"
          className="input"
          placeholder="Nama gerakan..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="input" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="btn btn-primary" disabled={adding || !name.trim()}>
          {adding ? '...' : 'Tambah'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <MuscleSelector
        category={category}
        selected={selectedMuscles}
        onChange={setSelectedMuscles}
      />

      <input
        type="text"
        className="input search-input"
        placeholder="Cari gerakan..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {Object.keys(filteredGrouped).length === 0 ? (
        <p className="empty-hint">Belum ada gerakan. Tambahkan gerakan latihan di atas.</p>
      ) : (
        Object.entries(filteredGrouped).map(([cat, exs]) => (
          <div key={cat} className="exercise-group">
            <h3 className="group-title">{cat}</h3>
            <div className="exercise-tags">
              {exs.map(ex => (
                <div key={ex.id} className="exercise-tag-wrapper">
                  <div
                    className={`exercise-tag ${selectedEx?.id === ex.id ? 'selected' : ''}`}
                    onClick={() => setSelectedEx(selectedEx?.id === ex.id ? null : ex)}
                  >
                    <span>{ex.name}</span>
                    <button className="btn-icon-sm" onClick={(e) => { e.stopPropagation(); handleDelete(ex.id) }} title="Hapus">×</button>
                  </div>
                  {selectedEx?.id === ex.id && (
                    <div className="exercise-detail">
                      <div className="detail-info">
                        <span className="detail-category">
                          Bagian tubuh: <strong>{ex.category || 'Lainnya'}</strong>
                        </span>
                        <div className="detail-muscles">
                          <span className="detail-muscles-label">Otot target:</span>
                          <div className="detail-muscles-list">
                            {getHighlightMuscleIds(ex).length > 0
                              ? getHighlightMuscleIds(ex).map(id => {
                                  const def = MUSCLE_BY_ID[id]
                                  return def
                                    ? <span key={id} className="detail-muscle-tag">{def.label}</span>
                                    : <span key={id} className="detail-muscle-tag">{id}</span>
                                })
                              : <span className="detail-muscle-none">Semua {ex.category}</span>
                            }
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => handleEditMuscles(ex)}
                        >
                          Edit target otot
                        </button>
                      </div>
                      <div className="detail-diagram">
                        <BodyDiagram muscleIds={getHighlightMuscleIds(ex)} size={140} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {editingMuscles && (
        <div className="modal-overlay" onClick={() => setEditingMuscles(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit target otot: {editingMuscles.exercise.name}</h3>
            <MuscleSelector
              category={editingMuscles.exercise.category}
              selected={editingMuscles.selected}
              onChange={(next) => setEditingMuscles({ ...editingMuscles, selected: next })}
            />
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setEditingMuscles(null)}>Batal</button>
              <button type="button" className="btn btn-primary" onClick={saveEditMuscles}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExerciseManager
