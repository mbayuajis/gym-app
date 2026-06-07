import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../../api'
import BodyDiagram from '../../components/BodyDiagram'
import { MUSCLE_BY_ID, CATEGORY_TO_ALL_MUSCLE_IDS } from '../../muscleData'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { EventClickArg } from "@fullcalendar/core"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"
import Badge from "../../components/ui/badge/Badge"
import PageMeta from "../../components/common/PageMeta"
import ComponentCard from "../../components/common/ComponentCard"

function getExerciseMuscleIds(ex) {
  if (ex.sub_muscles && ex.sub_muscles.length > 0) return ex.sub_muscles
  const defaults = CATEGORY_TO_ALL_MUSCLE_IDS[ex.category]
  return defaults || []
}

function WorkoutDetail({ workout, onClose }) {
  const allMuscleIds = []
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
            {workout.exercises?.map((ex, i) => (
              <div key={ex.id || i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{ex.name || 'Unknown'}</h4>
                  <div className="flex flex-wrap gap-1">
                    {getExerciseMuscleIds(ex).map(id => {
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
                      {ex.sets.map((set, si) => (
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

function HistoryPage() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [detailWorkout, setDetailWorkout] = useState(null)
  const calendarRef = useRef(null)
  const loadKeyRef = useRef(0)

  const loadWorkouts = useCallback(() => {
    const key = ++loadKeyRef.current
    api.getWorkouts().then(data => {
      if (key === loadKeyRef.current) {
        setWorkouts(data)
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => { loadWorkouts() }, [loadWorkouts])

  const workoutDates = workouts.map(w => ({
    title: `${(w.exercises || []).length} gerakan`,
    start: w.date,
    allDay: true,
    extendedProps: { workout: w },
  }))

  const filteredWorkouts = selectedDate
    ? workouts.filter(w => w.date === selectedDate)
    : workouts

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event
    setSelectedDate(event.startStr)
    const w = event.extendedProps.workout
    if (w) setDetailWorkout(w)
  }

  const handleDateClick = (info: any) => {
    const dateStr = info.dateStr
    if (selectedDate === dateStr) {
      setSelectedDate(null)
    } else {
      setSelectedDate(dateStr)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
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
      <PageMeta title="Riwayat Workout" description="Riwayat latihan" />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Riwayat Workout</h2>

        {/* Calendar */}
        <ComponentCard title="Kalender Latihan">
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
              eventContent={(eventInfo) => (
                <div className="fc-event-main flex items-center gap-1 p-0.5 text-xs rounded-sm"
                  style={{ backgroundColor: '#855747', color: '#fff' }}>
                  <span>🏋️</span>
                  <span className="fc-event-title truncate">{eventInfo.event.title}</span>
                </div>
              )}
            />
          </div>
        </ComponentCard>

        {/* Filter indicator */}
        {selectedDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Menampilkan: <strong>{formatDate(selectedDate)}</strong></span>
            <button onClick={() => setSelectedDate(null)} className="text-brand-500 hover:underline text-xs">Tampilkan Semua</button>
          </div>
        )}

        {/* Workout table */}
        {filteredWorkouts.length > 0 ? (
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
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {filteredWorkouts.map(w => {
                    const totalSets = (w.exercises || []).reduce((s, ex) => s + (ex.sets?.length || 0), 0)
                    const totalVolume = (w.exercises || []).reduce((s, ex) =>
                      s + (ex.sets || []).reduce((ss, set) => ss + (set.reps || 0) * (set.weight || 0), 0), 0)
                    const categories = [...new Set((w.exercises || []).map(ex => ex.category).filter(Boolean))]
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
                            {categories.map(cat => (
                              <Badge key={cat} size="sm" color="primary">{cat}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {w.notes || '-'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {selectedDate ? 'Tidak ada workout di tanggal ini' : 'Belum ada workout. Mulai catat latihanmu!'}
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

export default HistoryPage
