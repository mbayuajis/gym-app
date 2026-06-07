import { useState } from 'react'
import { api } from '../api'

function SetRow({ set, onChange, onRemove }) {
  return (
    <div className="set-row">
      <input
        type="number"
        className="input input-sm"
        placeholder="Reps"
        value={set.reps || ''}
        onChange={(e) => onChange({ ...set, reps: Number(e.target.value) })}
        min="0"
      />
      <input
        type="number"
        className="input input-sm"
        placeholder="Berat (kg)"
        value={set.weight || ''}
        onChange={(e) => onChange({ ...set, weight: Number(e.target.value) })}
        min="0"
        step="0.5"
      />
      <button type="button" className="btn btn-icon" onClick={onRemove} title="Hapus set">×</button>
    </div>
  )
}

function ExerciseBlock({ exercise, exercises, onChange, onRemove }) {
  const ex = exercises.find(e => e.id === exercise.exercise_id)
  const totalSets = (exercise.sets || []).length
  const totalReps = (exercise.sets || []).reduce((s, set) => s + (set.reps || 0), 0)

  const addSet = () => {
    const newSets = [...(exercise.sets || []), { reps: 10, weight: 0 }]
    onChange({ ...exercise, sets: newSets })
  }

  const updateSet = (idx, set) => {
    const newSets = [...(exercise.sets || [])]
    newSets[idx] = set
    onChange({ ...exercise, sets: newSets })
  }

  const removeSet = (idx) => {
    const newSets = (exercise.sets || []).filter((_, i) => i !== idx)
    onChange({ ...exercise, sets: newSets })
  }

  return (
    <div className="exercise-block">
      <div className="exercise-block-header">
        <select
          className="input"
          value={exercise.exercise_id || ''}
          onChange={(e) => {
            const id = Number(e.target.value)
            const selected = exercises.find(ex => ex.id === id)
            onChange({
              ...exercise,
              exercise_id: id,
              exercise_name: selected?.name || ''
            })
          }}
        >
          <option value="">Pilih gerakan...</option>
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>
              {ex.name} {ex.category ? `(${ex.category})` : ''}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-icon" onClick={onRemove} title="Hapus exercise">×</button>
      </div>

      <div className="sets-section">
        <div className="sets-header">
          <span>Set</span>
          <span>Reps</span>
          <span>Berat</span>
          <span></span>
        </div>
        {(exercise.sets || []).map((set, i) => (
          <div key={i} className="set-item">
            <span className="set-number">{i + 1}</span>
            <SetRow set={set} onChange={(s) => updateSet(i, s)} onRemove={() => removeSet(i)} />
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addSet}>
          + Tambah Set
        </button>
      </div>

      {totalSets > 0 && (
        <div className="exercise-summary">
          {totalSets} set × total {totalReps} reps
        </div>
      )}
    </div>
  )
}

function WorkoutForm({ exercises, onSaved }) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [notes, setNotes] = useState('')
  const [workoutExercises, setWorkoutExercises] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addExercise = () => {
    setWorkoutExercises([...workoutExercises, { exercise_id: 0, sets: [] }])
  }

  const updateExercise = (idx, updated) => {
    const newList = [...workoutExercises]
    newList[idx] = updated
    setWorkoutExercises(newList)
  }

  const removeExercise = (idx) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validExercises = workoutExercises.filter(ex => ex.exercise_id && ex.exercise_id > 0)
    if (validExercises.length === 0) {
      setError('Tambahkan minimal 1 gerakan')
      return
    }

    setSaving(true)
    try {
      await api.createWorkout({ date, notes, exercises: validExercises })
      setDate(today)
      setNotes('')
      setWorkoutExercises([])
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Workout Baru</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Tanggal</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="label">Catatan (opsional)</label>
          <textarea className="input textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contoh: Push day, progres bagus..." rows={2} />
        </div>

        <div className="form-group">
          <div className="flex-between">
            <label className="label">Gerakan</label>
            <button type="button" className="btn btn-outline btn-sm" onClick={addExercise}>
              + Tambah Gerakan
            </button>
          </div>

          {workoutExercises.length === 0 && (
            <p className="empty-hint">Klik "Tambah Gerakan" untuk memulai</p>
          )}

          <div className="exercises-list">
            {workoutExercises.map((ex, i) => (
              <ExerciseBlock
                key={i}
                exercise={ex}
                exercises={exercises}
                onChange={(updated) => updateExercise(i, updated)}
                onRemove={() => removeExercise(i)}
              />
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Workout'}
        </button>
      </form>
    </div>
  )
}

export default WorkoutForm
