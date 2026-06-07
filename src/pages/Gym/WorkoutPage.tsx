import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../../api'
import PageMeta from "../../components/common/PageMeta"
import BodyDiagram from '../../components/BodyDiagram'
import { CATEGORY_TO_ALL_MUSCLE_IDS, MUSCLE_BY_ID } from '../../muscleData'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { EventClickArg } from "@fullcalendar/core"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"
import Badge from "../../components/ui/badge/Badge"
import ComponentCard from "../../components/common/ComponentCard"

function getExerciseMuscleIds(ex: any) {
  if (ex.sub_muscles && ex.sub_muscles.length > 0) return ex.sub_muscles
  const defaults = CATEGORY_TO_ALL_MUSCLE_IDS[ex.category]
  return defaults || []
}

function WorkoutDetail({ workout, onClose }: any) {
  const allMuscleIds: string[] = []
  if (workout.exercises) {
    for (const ex of workout.exercises) {
      allMuscleIds.push(...getExerciseMuscleIds(ex))
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-16 bg-black/30" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              {new Date(workout.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>

          {allMuscleIds.length > 0 && (
            <div className="flex justify-center mb-4">
              <BodyDiagram muscleIds={allMuscleIds} size={100} />
            </div>
          )}

          {workout.notes && (
            <p className="text-sm text-gray-500 mb-4 italic">{workout.notes}</p>
          )}

          <div className="space-y-3">
            {workout.exercises?.map((ex: any, i: number) => (
              <div key={ex.id || i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{ex.name || 'Unknown'}</h4>
                  <div className="flex flex-wrap gap-1">
                    {getExerciseMuscleIds(ex).map((id: string) => {
                      const def = MUSCLE_BY_ID[id]
                      return (
                        <span key={id} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          {def?.label || id}
                        </span>
                      )
                    })}
                  </div>
                </div>
                {ex.sets && ex.sets.length > 0 && (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-100 dark:border-gray-800">
                        <th className="py-1 text-left w-10">Set</th>
                        <th className="py-1 text-left">Reps</th>
                        <th className="py-1 text-left">Berat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ex.sets.map((set: any, si: number) => (
                        <tr key={set.id || si} className="border-b border-gray-50 dark:border-gray-800/50">
                          <td className="py-1">{si + 1}</td>
                          <td className="py-1">{set.reps}</td>
                          <td className="py-1">{set.weight > 0 ? `${set.weight} kg` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SetRow({ set, onChange, onRemove }: any) {
  return (
    <div className="flex items-center gap-1.5">
      <input type="number" className="input input-xs w-12 text-xs text-center" placeholder="Reps"
        value={set.reps || ''} onChange={e => onChange({ ...set, reps: Number(e.target.value) })} min="0" />
      <span className="text-gray-400 text-xs">×</span>
      <input type="number" className="input input-xs w-14 text-xs text-center" placeholder="Kg"
        value={set.weight || ''} onChange={e => onChange({ ...set, weight: Number(e.target.value) })} min="0" step="0.5" />
      <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 text-xs px-1">&times;</button>
    </div>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function WorkoutPage() {
  const [exercises, setExercises] = useState<any[]>([])
  const [workouts, setWorkouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Workout form
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [notes, setNotes] = useState('')
  const [workoutExercises, setWorkoutExercises] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  // History / calendar
  const calendarRef = useRef<any>(null)
  const loadKeyRef = useRef(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [detailWorkout, setDetailWorkout] = useState<any>(null)
  const [showCalendar, setShowCalendar] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const loadData = useCallback(() => {
    const key = ++loadKeyRef.current
    Promise.all([api.getExercises(), api.getWorkouts()]).then(([exData, wData]) => {
      if (key === loadKeyRef.current) {
        setExercises(exData)
        setWorkouts(wData)
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const addExercise = () => setWorkoutExercises([...workoutExercises, { exercise_id: 0, sets: [] }])

  const updateExercise = (idx: number, updated: any) => {
    const list = [...workoutExercises]
    list[idx] = updated
    setWorkoutExercises(list)
  }

  const removeExercise = (idx: number) => setWorkoutExercises(workoutExercises.filter((_, i) => i !== idx))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    const valid = workoutExercises.filter((ex: any) => ex.exercise_id && ex.exercise_id > 0)
    if (valid.length === 0) { setError('Tambahkan minimal 1 gerakan'); return }
    setSaving(true)
    try {
      await api.createWorkout({ date, notes, exercises: valid })
      setDate(today); setNotes(''); setWorkoutExercises([]); setShowForm(false)
      loadData()
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  // Calendar events
  const workoutDates = workouts.map((w: any) => ({
    title: `${(w.exercises || []).length} gerakan`,
    start: w.date,
    allDay: true,
    extendedProps: { workout: w },
  }))

  const filteredWorkouts = (selectedDate
    ? workouts.filter((w: any) => w.date === selectedDate)
    : workouts
  ).filter((w: any) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const categories = [...new Set((w.exercises || []).map((ex: any) => ex.category).filter(Boolean))]
    if (w.notes?.toLowerCase().includes(q)) return true
    if (categories.some((c: string) => c.toLowerCase().includes(q))) return true
    return false
  })

  const totalPages = Math.max(1, Math.ceil(filteredWorkouts.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedWorkouts = filteredWorkouts.slice((safePage - 1) * pageSize, safePage * pageSize)

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedDate(clickInfo.event.startStr)
    const w = clickInfo.event.extendedProps.workout
    if (w) setDetailWorkout(w)
  }

  const handleDelete = async (id: number) => {
    try {
      await api.deleteWorkout(id)
      setDeleteConfirm(null)
      loadData()
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message)
    }
  }

  const handleDateClick = (info: any) => {
    const dateStr = info.dateStr
    if (selectedDate === dateStr) {
      setSelectedDate(null)
    } else {
      setSelectedDate(dateStr)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  return (
    <>
      <PageMeta title="Workout" description="Catat latihan dan lihat riwayat" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Workout</h2>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Tutup' : '+ Catat Workout'}
          </button>
        </div>

        {/* Workout Form */}
        {showForm && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="font-semibold mb-4">Workout Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Tanggal</label>
                  <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1">Catatan (opsional)</label>
                  <input type="text" className="input w-full" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Push day, progres bagus..." />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Gerakan</label>
                  <button type="button" className="btn btn-outline btn-xs" onClick={addExercise}>+ Tambah</button>
                </div>
                {workoutExercises.length === 0 && (
                  <p className="text-sm text-gray-400">Klik "Tambah" untuk memulai</p>
                )}
                <div className="space-y-3">
                  {workoutExercises.map((ex: any, i: number) => (
                    <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <select className="input flex-1 text-sm" value={ex.exercise_id || ''}
                          onChange={e => {
                            const id = Number(e.target.value)
                            const sel = exercises.find((x: any) => x.id === id)
                            updateExercise(i, { ...ex, exercise_id: id, exercise_name: sel?.name || '' })
                          }}>
                          <option value="">Pilih gerakan...</option>
                          {exercises.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <button type="button" onClick={() => removeExercise(i)} className="text-red-400 hover:text-red-600 text-sm">&times;</button>
                      </div>
                      <div>
                        <div className="grid grid-cols-[auto_1fr] gap-1.5">
                          {(ex.sets || []).map((set: any, si: number) => (
                            <div key={si} className="contents">
                              <span className="text-xs text-gray-400 pt-1.5 w-5 text-right">{si + 1}</span>
                              <SetRow set={set}
                                onChange={(s: any) => {
                                  const sets = [...(ex.sets || [])]
                                  sets[si] = s
                                  updateExercise(i, { ...ex, sets })
                                }}
                                onRemove={() => {
                                  const sets = (ex.sets || []).filter((_: any, j: number) => j !== si)
                                  updateExercise(i, { ...ex, sets })
                                }} />
                            </div>
                          ))}
                        </div>
                        <button type="button" className="btn btn-outline btn-xs mt-1.5" onClick={() => {
                          const sets = [...(ex.sets || []), { reps: 10, weight: 0 }]
                          updateExercise(i, { ...ex, sets })
                        }}>+ Set</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Workout'}
              </button>
            </form>
          </div>
        )}

        {/* Calendar */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <button onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center justify-between w-full px-5 py-4 text-left">
            <span className="font-semibold">Kalender Latihan</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCalendar ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCalendar && (
            <div className="px-5 pb-5">
              <div className="custom-calendar">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "dayGridMonth",
                  }}
                  events={workoutDates}
                  eventClick={handleEventClick}
                  dateClick={handleDateClick}
                  height="auto"
                  eventContent={(eventInfo: any) => (
                    <div className="fc-event-main flex items-center gap-1 p-0.5 text-xs rounded-sm"
                      style={{ backgroundColor: '#855747', color: '#fff' }}>
                      <span>🏋</span>
                      <span className="fc-event-title truncate">{eventInfo.event.title}</span>
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input type="text" className="input w-full" placeholder="Cari catatan atau kategori..."
              value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
          </div>
          {selectedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span><strong>{formatDate(selectedDate)}</strong></span>
              <button onClick={() => { setSelectedDate(null); setCurrentPage(1) }} className="text-brand-500 hover:underline text-xs">Tampilkan Semua</button>
            </div>
          )}
        </div>

        {/* Workout table */}
        {paginatedWorkouts.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tanggal</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Gerakan</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Set</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Volume</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kategori</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Catatan</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {paginatedWorkouts.map((w: any) => {
                    const totalSets = (w.exercises || []).reduce((s: number, ex: any) => s + (ex.sets?.length || 0), 0)
                    const totalVolume = (w.exercises || []).reduce((s: number, ex: any) =>
                      s + (ex.sets || []).reduce((ss: number, set: any) => ss + (set.reps || 0) * (set.weight || 0), 0), 0)
                    const categories = [...new Set((w.exercises || []).map((ex: any) => ex.category).filter(Boolean))]
                    return (
                      <TableRow key={w.id}>
                        <TableCell className="px-5 py-4 text-start">
                          <button onClick={() => { setDetailWorkout(w) }}
                            className="font-medium text-gray-800 dark:text-white/90 text-theme-sm hover:text-brand-500 transition">
                            {new Date(w.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </button>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {w.exercises?.length || 0}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {totalSets}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {totalVolume > 0 ? `${totalVolume.toLocaleString()} kg` : '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {categories.map((cat: string) => (
                              <Badge key={cat} size="sm" color="primary">{cat}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {w.notes || '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {deleteConfirm === w.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(w.id)}
                                className="text-xs text-red-600 hover:underline">Yakin?</button>
                              <button onClick={() => setDeleteConfirm(null)}
                                className="text-xs text-gray-400 hover:underline">Batal</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(w.id)}
                              className="text-red-400 hover:text-red-600 text-sm">&times;</button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">
                {filteredWorkouts.length} data &middot; Halaman {safePage} dari {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 disabled:opacity-30"
                  disabled={safePage <= 1} onClick={() => setCurrentPage(safePage - 1)}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`px-2.5 py-1 text-xs rounded border ${p === safePage ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => setCurrentPage(p)}>{p}</button>
                ))}
                <button className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 disabled:opacity-30"
                  disabled={safePage >= totalPages} onClick={() => setCurrentPage(safePage + 1)}>Next</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Tidak ada hasil untuk pencarian ini' : selectedDate ? 'Tidak ada workout di tanggal ini' : 'Belum ada workout. Mulai catat latihanmu!'}
            </p>
          </div>
        )}
      </div>

      {detailWorkout && (
        <WorkoutDetail workout={detailWorkout} onClose={() => setDetailWorkout(null)} />
      )}
    </>
  )
}

export default WorkoutPage
