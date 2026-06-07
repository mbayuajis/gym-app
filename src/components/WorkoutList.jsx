import { useState } from 'react'
import { api } from '../api'
import BodyDiagram from './BodyDiagram'
import { MUSCLE_BY_ID, CATEGORY_TO_ALL_MUSCLE_IDS } from '../muscleData'

function WorkoutCard({ workout, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const categories = [...new Set(
    (workout.exercises || []).map(ex => ex.category).filter(Boolean)
  )]
  const totalExercises = workout.exercises?.length || 0
  const totalSets = (workout.exercises || []).reduce(
    (sum, ex) => sum + (ex.sets?.length || 0), 0
  )

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleDelete = async () => {
    if (!confirm('Hapus workout ini?')) return
    setDeleting(true)
    try {
      await api.deleteWorkout(workout.id)
      onDelete()
    } catch {
      setDeleting(false)
    }
  }

  const getExerciseMuscleIds = (ex) => {
    if (ex.sub_muscles && ex.sub_muscles.length > 0) return ex.sub_muscles
    const defaults = CATEGORY_TO_ALL_MUSCLE_IDS[ex.category]
    return defaults || []
  }

  const allMuscleIds = []
  if (workout.exercises) {
    for (const ex of workout.exercises) {
      allMuscleIds.push(...getExerciseMuscleIds(ex))
    }
  }

  return (
    <div className={`workout-card ${expanded ? 'expanded' : ''}`}>
      <div className="workout-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="workout-card-info">
          <h3>{formatDate(workout.date)}</h3>
          <span className="workout-stats">
            {totalExercises} gerakan · {totalSets} set
          </span>
          {categories.length > 0 && (
            <div className="workout-categories">
              {categories.map(cat => (
                <span key={cat} className="category-badge">{cat}</span>
              ))}
            </div>
          )}
        </div>
        <div className="workout-card-actions">
          {workout.notes && <span className="notes-badge">📝</span>}
          <button
            className="btn btn-icon btn-danger"
            onClick={(e) => { e.stopPropagation(); handleDelete() }}
            disabled={deleting}
            title="Hapus workout"
          >
            🗑️
          </button>
          <span className={`chevron ${expanded ? 'open' : ''}`}>▾</span>
        </div>
      </div>

      {expanded && (
        <div className="workout-detail">
          {allMuscleIds.length > 0 && (
            <div className="workout-body-diagram">
              <BodyDiagram muscleIds={allMuscleIds} size={120} />
            </div>
          )}
          {workout.notes && <p className="workout-notes">{workout.notes}</p>}

          {workout.exercises?.map((ex, i) => (
            <div key={ex.id || i} className="workout-exercise">
              <div className="workout-exercise-header">
                <h4>{ex.name || 'Unknown'}</h4>
                <span className="tooltip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z"/></svg>
                </span>
                <div className="detail-muscles-list">
                  {getExerciseMuscleIds(ex).map(id => {
                    const def = MUSCLE_BY_ID[id]
                    return def
                      ? <span key={id} className="detail-muscle-tag">{def.label}</span>
                      : <span key={id} className="detail-muscle-tag">{id}</span>
                  })}
                </div>
              </div>
              {ex.sets && ex.sets.length > 0 && (
                <table className="sets-table">
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>Reps</th>
                      <th>Berat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ex.sets.map((set, si) => (
                      <tr key={set.id || si}>
                        <td>{si + 1}</td>
                        <td>{set.reps}</td>
                        <td>{set.weight > 0 ? `${set.weight} kg` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WorkoutList({ workouts, onDelete }) {
  if (workouts.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <span className="empty-icon">💪</span>
          <h2>Belum ada workout</h2>
          <p>Mulai catat latihan pertamamu!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="workout-list">
      <h2 className="card-title">Riwayat Workout</h2>
      {workouts.map(w => (
        <WorkoutCard key={w.id} workout={w} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default WorkoutList
