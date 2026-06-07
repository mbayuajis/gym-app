import { useState, useEffect } from 'react'
import { api } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

function WorkoutWeekChart({ data }) {
  return (
    <div className="stat-chart">
      <h3 className="stat-chart-title">Workout per Minggu</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <XAxis
            dataKey="week_start"
            tick={{ fontSize: 11, fill: '#8A766D' }}
            tickFormatter={v => {
              const d = new Date(v + 'T00:00:00')
              return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
            }}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8A766D' }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            labelFormatter={v => new Date(v + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          />
          <Bar dataKey="count" fill="#855747" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function VolumeChart({ data }) {
  return (
    <div className="stat-chart">
      <h3 className="stat-chart-title">Volume per Workout</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAE1D8" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#8A766D' }}
            tickFormatter={v => {
              const d = new Date(v + 'T00:00:00')
              return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
            }}
          />
          <YAxis tick={{ fontSize: 11, fill: '#8A766D' }} tickFormatter={v => v >= 1000 ? (v / 1000) + 'k' : v} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            formatter={v => [`${v} kg`, 'Volume']}
            labelFormatter={v => new Date(v + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          />
          <Line type="monotone" dataKey="total_volume" stroke="#855747" strokeWidth={2} dot={{ fill: '#855747', r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function CategoryChart({ data }) {
  const maxCount = Math.max(...data.map(c => c.count), 1)
  return (
    <div className="stat-chart">
      <h3 className="stat-chart-title">Kategori yang Sering Dilatih</h3>
      <div className="stat-category-list">
        {data.map(cat => (
          <div key={cat.category} className="stat-category-row">
            <span className="stat-category-name">{cat.category}</span>
            <div className="stat-category-bar-wrap">
              <div className="stat-category-bar" style={{ width: `${(cat.count / maxCount) * 100}%` }} />
            </div>
            <span className="stat-category-count">{cat.count}x</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Statistics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getStats()
      .then(data => {
        setStats(data)
        setError(null)
      })
      .catch(err => {
        setError(err.message || 'Gagal memuat statistik')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="dashboard">
        <div className="card"><p className="empty-hint">Memuat statistik...</p></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="card">
          <p className="empty-hint" style={{ color: '#C62828' }}>{error}</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="dashboard">
        <div className="card"><p className="empty-hint">Gagal memuat statistik</p></div>
      </div>
    )
  }

  const totalWorkouts = stats.workoutVolumes.length
  const totalExercises = stats.workoutVolumes.reduce((s, w) => s + w.exercise_count, 0)
  const totalSets = stats.workoutVolumes.reduce((s, w) => s + w.set_count, 0)
  const totalVolume = stats.workoutVolumes.reduce((s, w) => s + w.total_volume, 0)
  const avgVolume = totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0

  return (
    <div className="dashboard">
      <h2 className="card-title">Dashboard</h2>

      <div className="dash-cards">
        <div className="card dash-card">
          <div className="dash-card-icon">🏋️</div>
          <div className="dash-card-body">
            <div className="dash-number">{totalWorkouts}</div>
            <div className="dash-label">Total Workout</div>
          </div>
        </div>
        <div className="card dash-card">
          <div className="dash-card-icon">📋</div>
          <div className="dash-card-body">
            <div className="dash-number">{totalExercises}</div>
            <div className="dash-label">Total Gerakan</div>
          </div>
        </div>
        <div className="card dash-card">
          <div className="dash-card-icon">🔢</div>
          <div className="dash-card-body">
            <div className="dash-number">{totalSets}</div>
            <div className="dash-label">Total Set</div>
          </div>
        </div>
        <div className="card dash-card">
          <div className="dash-card-icon">📊</div>
          <div className="dash-card-body">
            <div className="dash-number">{totalVolume.toLocaleString()}</div>
            <div className="dash-label">Total Volume (kg)</div>
          </div>
        </div>
        <div className="card dash-card">
          <div className="dash-card-icon">📈</div>
          <div className="dash-card-body">
            <div className="dash-number">{avgVolume.toLocaleString()}</div>
            <div className="dash-label">Rata-rata Volume</div>
          </div>
        </div>
      </div>

      <div className="dash-charts">
        {stats.weeklyWorkouts.some(w => w.count > 0) && (
          <WorkoutWeekChart data={stats.weeklyWorkouts} />
        )}
        {stats.workoutVolumes.some(w => w.total_volume > 0) && (
          <VolumeChart data={stats.workoutVolumes} />
        )}
      </div>

      {stats.categoryDist.length > 0 && (
        <div className="dash-charts dash-charts--single">
          <CategoryChart data={stats.categoryDist} />
        </div>
      )}
    </div>
  )
}

export default Statistics
