import { useState, useEffect } from 'react'
import { api } from '../../api'

const GOAL_TYPES = [
  { value: 'turun_berat', label: 'Turun Berat Badan', unit: 'kg' },
  { value: 'naik_otot', label: 'Naik Massa Otot', unit: 'kg' },
  { value: 'naik_kekuatan', label: 'Naik Kekuatan', unit: 'kg' },
  { value: 'target_frekuensi', label: 'Target Frekuensi', unit: 'x/minggu' },
  { value: 'target_durasi', label: 'Target Durasi', unit: 'menit' },
  { value: 'custom', label: 'Custom', unit: '' },
]

const GOAL_TYPE_LABELS = {
  turun_berat: 'Turun Berat Badan',
  naik_otot: 'Naik Massa Otot',
  naik_kekuatan: 'Naik Kekuatan',
  target_frekuensi: 'Target Frekuensi',
  target_durasi: 'Target Durasi',
  custom: 'Custom',
}

function GoalCard({ goal, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(goal.current_value)

  const handleUpdateCurrent = async () => {
    await onUpdate(goal.id, { current_value: Number(currentValue) })
    setEditing(false)
  }

  const progress = goal.target_value > 0
    ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
    : 0

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium">{GOAL_TYPE_LABELS[goal.type] || goal.type}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Target: {goal.target_value} {goal.target_date ? `· ${goal.target_date}` : ''}
          </p>
        </div>
        <button type="button" onClick={() => onDelete(goal.id)}
          className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-brand-500 rounded-full h-2.5 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-medium whitespace-nowrap">{progress}%</span>
      </div>

      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <input type="number" className="input input-sm w-20" value={currentValue}
              onChange={e => setCurrentValue(e.target.value)} step="0.1" />
            <button type="button" onClick={handleUpdateCurrent}
              className="btn btn-primary btn-xs">Simpan</button>
            <button type="button" onClick={() => { setEditing(false); setCurrentValue(goal.current_value) }}
              className="btn btn-outline btn-xs">Batal</button>
          </>
        ) : (
          <>
            <span className="text-sm">Progress: <strong>{goal.current_value}</strong> / {goal.target_value}</span>
            <button type="button" onClick={() => setEditing(true)}
              className="btn btn-outline btn-xs ml-auto">Update</button>
          </>
        )}
      </div>

      {goal.status === 'completed' && (
        <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Tercapai ✓</span>
      )}
    </div>
  )
}

function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    type: '',
    target_value: '',
    start_date: '',
    target_date: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadGoals = () => api.getGoals().then(data => {
    setGoals(data)
    setLoading(false)
  })

  useEffect(() => { loadGoals() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.type) { setError('Pilih tipe goal'); return }
    setSaving(true)
    setError('')
    try {
      await api.createGoal({
        type: form.type,
        target_value: Number(form.target_value) || 0,
        target_date: form.target_date || '',
      })
      setForm({ type: '', target_value: '', start_date: '', target_date: '' })
      setShowForm(false)
      loadGoals()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id, data) => {
    await api.updateGoal(id, data)
    loadGoals()
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus goal ini?')) return
    await api.deleteGoal(id)
    loadGoals()
  }

  const activeGoals = goals.filter(g => g.status !== 'completed')
  const completedGoals = goals.filter(g => g.status === 'completed')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="card-title mb-0">Goals</h2>
        <button type="button" onClick={() => setShowForm(!showForm)}
          className="btn btn-primary btn-sm">
          + Goal Baru
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tipe Goal</label>
            <select className="input w-full" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="">Pilih tipe...</option>
              {GOAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Target Value</label>
              <input type="number" className="input w-full" value={form.target_value}
                onChange={e => setForm(f => ({ ...f, target_value: e.target.value }))} step="0.1" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Tanggal</label>
              <input type="date" className="input w-full" value={form.target_date}
                onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))} />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={saving} className="btn btn-primary btn-full">
            {saving ? 'Menyimpan...' : 'Buat Goal'}
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-full btn-sm">Batal</button>
        </form>
      )}

      {activeGoals.length === 0 && !showForm && (
        <div className="card p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Belum ada goal. Buat goal pertamamu!</p>
        </div>
      )}

      <div className="space-y-3">
        {activeGoals.map(g => (
          <GoalCard key={g.id} goal={g} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>

      {completedGoals.length > 0 && (
        <>
          <h3 className="font-medium text-sm text-gray-500 mt-6">Tercapai</h3>
          <div className="space-y-2">
            {completedGoals.map(g => (
              <div key={g.id} className="card p-3 flex items-center justify-between opacity-60">
                <div>
                  <span className="font-medium">{GOAL_TYPE_LABELS[g.type] || g.type}</span>
                  <span className="text-sm text-gray-500 ml-2">{g.current_value} / {g.target_value}</span>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default GoalsPage
