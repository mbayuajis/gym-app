import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { api } from '../../api'

const GOAL_TYPE_LABELS = {
  turun_berat: 'Turun Berat Badan',
  naik_otot: 'Naik Massa Otot',
  naik_kekuatan: 'Naik Kekuatan',
  target_frekuensi: 'Target Frekuensi',
  target_durasi: 'Target Durasi',
  custom: 'Custom',
}

function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const [workouts, setWorkouts] = useState([])
  const [goals, setGoals] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getProfile(),
      api.getWorkouts(),
      api.getGoals(),
      api.getStats(),
    ]).then(([profileData, workoutsData, goalsData, statsData]) => {
      setProfile(profileData)
      setWorkouts(workoutsData)
      setGoals(goalsData)
      setStats(statsData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  // Calculate streak
  let streak = 0
  if (workouts.length > 0) {
    const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date))
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let checkDate = new Date(today)

    for (const w of sorted) {
      const wDate = new Date(w.date + 'T00:00:00')
      const diff = Math.round((checkDate - wDate) / 86400000)
      if (diff === 0 || diff === 1) {
        streak++
        checkDate = wDate
        if (diff === 1) checkDate = wDate
      } else if (diff > 1) {
        break
      }
    }
  }

  // This week workouts
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekStart = new Date(today)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  const thisWeekWorkouts = workouts.filter(w => {
    const d = new Date(w.date + 'T00:00:00')
    return d >= weekStart
  })

  // Active goals
  const activeGoals = goals.filter(g => g.status !== 'completed')
  const totalVolume = workouts.reduce((sum, w) => {
    const exVol = (w.exercises || []).reduce((s, ex) => {
      return s + (ex.sets || []).reduce((ss, set) => ss + (set.reps || 0) * (set.weight || 0), 0)
    }, 0)
    return sum + exVol
  }, 0)

  const todayStr = today.toISOString().slice(0, 10)
  const todayWorkout = workouts.find(w => w.date === todayStr)

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          {profile?.name ? `Halo, ${profile.name}!` : 'Halo!'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Streak + Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-brand-500">{streak}</div>
          <div className="text-xs text-gray-500 mt-1">Streak</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold">{thisWeekWorkouts.length}</div>
          <div className="text-xs text-gray-500 mt-1">Minggu ini</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold">{workouts.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total Workout</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-sm">{totalVolume.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Total Volume</div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Hari Ini</h3>
          <Link to="/workout" className="text-sm text-brand-500 hover:underline">
            {todayWorkout ? 'Lihat Detail' : '+ Catat Workout'}
          </Link>
        </div>
        {todayWorkout ? (
          <div>
            <p className="text-sm">
              {todayWorkout.exercises?.length || 0} gerakan ·{' '}
              {(todayWorkout.exercises || []).reduce((s, ex) => s + (ex.sets?.length || 0), 0)} set
            </p>
            {todayWorkout.notes && <p className="text-xs text-gray-500 mt-1">{todayWorkout.notes}</p>}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Belum ada workout hari ini.</p>
        )}
      </div>

      {/* Goals Progress */}
      {activeGoals.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Goals</h3>
            <Link to="/goals" className="text-sm text-brand-500 hover:underline">Lihat Semua</Link>
          </div>
          <div className="space-y-3">
            {activeGoals.slice(0, 3).map(g => {
              const progress = g.target_value > 0
                ? Math.min(100, Math.round((g.current_value / g.target_value) * 100))
                : 0
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{GOAL_TYPE_LABELS[g.type] || g.type}</span>
                    <span className="text-gray-500">{progress}%</span>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-brand-500 rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Workouts */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Workout Terbaru</h3>
          <Link to="/history" className="text-sm text-brand-500 hover:underline">Riwayat</Link>
        </div>
        {workouts.length > 0 ? (
          <div className="space-y-2">
            {workouts.slice(0, 5).map(w => (
              <Link key={w.id} to="/history" className="block py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 transition">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {new Date(w.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-xs text-gray-400">
                    {(w.exercises || []).length} gerakan
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Belum ada workout.</p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/workout" className="card p-4 text-center hover:border-brand-500 transition border-2 border-transparent">
          <span className="text-2xl">🏋️</span>
          <p className="text-sm font-medium mt-1">Workout Baru</p>
        </Link>
        <Link to="/exercises" className="card p-4 text-center hover:border-brand-500 transition border-2 border-transparent">
          <span className="text-2xl">📋</span>
          <p className="text-sm font-medium mt-1">Latihan</p>
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
