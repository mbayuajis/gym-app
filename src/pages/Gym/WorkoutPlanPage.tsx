import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../../api'
import PageMeta from "../../components/common/PageMeta"

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

function CompleteModal({ plan, onClose }: { plan: any; onClose: () => void }) {
  const navigate = useNavigate()
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState(`Dari plan: ${plan.name}`)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await api.completeWorkoutPlan(plan.id, { date, notes })
      onClose()
      navigate('/workout')
    } catch { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <h3 className="font-semibold mb-4">Selesaikan Plan</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Tanggal</label>
              <input type="date" className="input w-full" value={date}
                onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Catatan (opsional)</label>
              <input type="text" className="input w-full" value={notes}
                onChange={e => setNotes(e.target.value)} placeholder="Catatan workout..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Batal</button>
            <button type="button" className="btn btn-primary btn-sm" disabled={saving}
              onClick={handleSubmit}>
              {saving ? '...' : 'Simpan ke Workout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkoutPlanPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<any[]>([])
  const [grouped, setGrouped] = useState<Record<string, any[]>>({})
  const [exercises, setExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1])
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [completePlan, setCompletePlan] = useState<any>(null)

  // Preview modal
  const [preview, setPreview] = useState<any[] | null>(null)
  const [previewMeta, setPreviewMeta] = useState<any>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')

  const [form, setForm] = useState({
    name: '',
    day: DAYS[0],
    estimated_duration: '',
    notes: '',
    exercises: [] as any[],
  })

  const loadData = () => {
    Promise.all([
      api.getWorkoutPlans(),
      api.getExercises(),
    ]).then(([planData, exData]) => {
      setPlans(planData.plans)
      setGrouped(planData.grouped)
      setExercises(exData)
      setLoading(false)
    })
  }

  useEffect(() => { loadData() }, [])

  const openNewForm = (day?: string) => {
    setEditingPlan(null)
    setForm({ name: '', day: day || selectedDay, estimated_duration: '', notes: '', exercises: [] })
    setShowForm(true)
    setError('')
  }

  const openEditForm = (plan: any) => {
    setEditingPlan(plan)
    setForm({
      name: plan.name,
      day: plan.day,
      estimated_duration: plan.estimated_duration?.toString() || '',
      notes: plan.notes || '',
      exercises: (plan.exercises || []).map((e: any) => ({
        exercise_id: e.exercise_id,
        target_sets: e.target_sets,
        target_reps: e.target_reps,
        target_weight: e.target_weight,
      })),
    })
    setShowForm(true)
    setError('')
  }

  const updateExercise = (idx: number, field: string, value: any) => {
    setForm(f => {
      const exs = [...f.exercises]
      exs[idx] = { ...exs[idx], [field]: value }
      return { ...f, exercises: exs }
    })
  }

  const addExercise = () => {
    setForm(f => ({ ...f, exercises: [...f.exercises, { exercise_id: 0, target_sets: 3, target_reps: 10, target_weight: 0 }] }))
  }

  const removeExercise = (idx: number) => {
    setForm(f => ({ ...f, exercises: f.exercises.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nama plan wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        estimated_duration: Number(form.estimated_duration) || 0,
        exercises: form.exercises.filter((ex: any) => ex.exercise_id > 0),
      }
      if (editingPlan) {
        await api.updateWorkoutPlan(editingPlan.id, payload)
      } else {
        await api.createWorkoutPlan(payload)
      }
      setShowForm(false)
      setEditingPlan(null)
      loadData()
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus plan ini?')) return
    await api.deleteWorkoutPlan(id)
    loadData()
  }

  const handleCompleteClick = (plan: any) => setCompletePlan(plan)

  // --- Preview flow ---
  const loadPreview = async () => {
    setPreviewLoading(true); setPreviewError('')
    try {
      const res = await api.previewWorkoutPlans()
      setPreview(res.preview)
      setPreviewMeta(res)
    } catch (err: any) { setPreviewError(err.message) }
    finally { setPreviewLoading(false) }
  }

  const updatePreviewExercise = (planIdx: number, exIdx: number, field: string, value: any) => {
    setPreview(prev => {
      const copy = [...prev]
      copy[planIdx] = { ...copy[planIdx], exercises: [...copy[planIdx].exercises] }
      copy[planIdx].exercises[exIdx] = { ...copy[planIdx].exercises[exIdx], [field]: value }
      return copy
    })
  }

  const removePreviewExercise = (planIdx: number, exIdx: number) => {
    setPreview(prev => {
      const copy = [...prev]
      copy[planIdx] = { ...copy[planIdx], exercises: copy[planIdx].exercises.filter((_: any, i: number) => i !== exIdx) }
      return copy
    })
  }

  const addPreviewExercise = (planIdx: number) => {
    setPreview(prev => {
      const copy = [...prev]
      copy[planIdx] = { ...copy[planIdx], exercises: [...copy[planIdx].exercises, { exercise_id: 0, name: '', target_sets: 3, target_reps: 10, target_weight: 0, rest_time: 60 }] }
      return copy
    })
  }

  const applyPreview = async () => {
    setPreviewLoading(true)
    try {
      await api.suggestWorkoutPlans({ plans: preview })
      setPreview(null)
      loadData()
    } catch (err: any) { setPreviewError(err.message) }
    finally { setPreviewLoading(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  const dayPlans = grouped[selectedDay] || []

  return (
    <>
      <PageMeta title="Workout Plan" description="Rencana latihan" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Workout Plan</h2>
          <div className="flex gap-2">
            <button onClick={loadPreview} disabled={previewLoading} className="btn btn-outline btn-sm">
              {previewLoading ? '...' : '💡 Saran'}
            </button>
            <button onClick={() => openNewForm()} className="btn btn-primary btn-sm">+ Plan Baru</button>
          </div>
        </div>

        {/* Day tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {DAYS.map((d, i) => (
            <button key={d} onClick={() => setSelectedDay(d)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                selectedDay === d
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}>
              {DAY_LABELS[i]}
              {grouped[d] && grouped[d].length > 0 && (
                <span className="ml-1.5 text-xs opacity-70">({grouped[d].length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Day content */}
        <div className="space-y-3">
          {dayPlans.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-gray-400 dark:text-gray-500">Belum ada plan untuk {DAY_LABELS[DAYS.indexOf(selectedDay)]}</p>
              <button onClick={() => openNewForm(selectedDay)} className="btn btn-primary btn-sm mt-3">+ Buat Plan</button>
            </div>
          )}

          {dayPlans.map((plan: any) => {
            const totalSets = plan.exercises.reduce((s: number, e: any) => s + e.target_sets, 0)
            return (
              <div key={plan.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {plan.exercises.length} gerakan · {totalSets} set
                        {plan.estimated_duration > 0 && ` · ${plan.estimated_duration} menit`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleCompleteClick(plan)}
                        className="btn btn-primary btn-xs">
                        Selesai
                      </button>
                      <button onClick={() => openEditForm(plan)} className="btn btn-outline btn-xs">Edit</button>
                      <button onClick={() => handleDelete(plan.id)} className="text-red-400 hover:text-red-600 text-sm px-1">&times;</button>
                    </div>
                  </div>

                  {plan.notes && <p className="text-sm text-gray-500 mb-3 italic">{plan.notes}</p>}

                  <div className="space-y-2">
                    {plan.exercises.map((ex: any) => (
                      <div key={ex.id} className="flex items-center gap-3 text-sm bg-gray-50 dark:bg-white/[0.02] rounded-lg p-2.5">
                        <span className="font-medium flex-1">{ex.name}</span>
                        <span className="text-gray-500">{ex.target_sets}×{ex.target_reps}</span>
                        {ex.target_weight > 0 && <span className="text-gray-500">{ex.target_weight} kg</span>}
                        {ex.rest_time > 0 && <span className="text-gray-400 text-xs">{ex.rest_time}s rest</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {completePlan && (
        <CompleteModal plan={completePlan} onClose={() => setCompletePlan(null)} />
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-10 bg-black/40" onClick={() => setPreview(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-lg">Saran Workout Plan</h3>
                {previewMeta && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Berdasarkan profil: {previewMeta.goal_label} · {previewMeta.frequency}x/minggu
                  </p>
                )}
              </div>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {previewError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                  {previewError}
                </div>
              )}

              {preview.map((plan: any, pi: number) => (
                <div key={pi} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{DAY_LABELS[DAYS.indexOf(plan.day)]}</span>
                      <h4 className="font-medium text-sm">{plan.name}</h4>
                    </div>
                    <span className="text-xs text-gray-400">{plan.estimated_duration} menit</span>
                  </div>

                  {plan.notes && <p className="text-xs text-gray-500 italic mb-2">{plan.notes}</p>}

                  <div className="space-y-1.5">
                    {plan.exercises.map((ex: any, ei: number) => (
                      <div key={ei} className="flex items-center gap-1 text-sm bg-gray-50 dark:bg-white/[0.03] rounded-lg px-2 py-1">
                        <select className="input input-xs flex-1 min-w-[90px] text-xs" value={ex.exercise_id || 0}
                          onChange={e => updatePreviewExercise(pi, ei, 'exercise_id', Number(e.target.value))}>
                          <option value={0}>Pilih...</option>
                          {exercises.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <input type="number" className="input input-xs text-xs text-center shrink-0" value={ex.target_sets}
                          onChange={e => updatePreviewExercise(pi, ei, 'target_sets', Number(e.target.value))} min="1" title="Sets" style={{ width: '50px' }} />
                        <span className="text-gray-400 text-xs">×</span>
                        <input type="number" className="input input-xs text-xs text-center shrink-0" value={ex.target_reps}
                          onChange={e => updatePreviewExercise(pi, ei, 'target_reps', Number(e.target.value))} min="1" title="Reps" style={{ width: '50px' }} />
                        <input type="number" className="input input-xs text-xs text-center shrink-0" value={ex.target_weight}
                          onChange={e => updatePreviewExercise(pi, ei, 'target_weight', Number(e.target.value))} step="0.5" min="0" placeholder="kg" title="Berat (kg)" style={{ width: '58px' }} />
                        <button onClick={() => removePreviewExercise(pi, ei)} className="text-red-400 hover:text-red-600 text-xs px-1 shrink-0">&times;</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addPreviewExercise(pi)} className="btn btn-outline btn-xs mt-2">+ Exercise</button>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-3 shrink-0">
              <button onClick={() => setPreview(null)} className="btn btn-outline btn-sm">Batal</button>
              <button onClick={applyPreview} disabled={previewLoading} className="btn btn-primary btn-sm">
                {previewLoading ? 'Menyimpan...' : 'Terapkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-12 bg-black/30" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{editingPlan ? 'Edit Plan' : 'Plan Baru'}</h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nama Plan</label>
                <input type="text" className="input w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Contoh: Push Day" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Hari</label>
                  <select className="input w-full" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
                    {DAYS.map((d, i) => <option key={d} value={d}>{DAY_LABELS[i]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durasi (menit)</label>
                  <input type="number" className="input w-full" value={form.estimated_duration} onChange={e => setForm(f => ({ ...f, estimated_duration: e.target.value }))} min="0" placeholder="Opsional" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Catatan</label>
                <input type="text" className="input w-full" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Opsional" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Exercise</label>
                  <button type="button" onClick={addExercise} className="btn btn-outline btn-xs">+ Tambah</button>
                </div>

                {form.exercises.length === 0 && (
                  <p className="text-sm text-gray-400">Belum ada exercise</p>
                )}

                <div className="space-y-1.5">
                  {form.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-1 rounded-lg bg-gray-50 dark:bg-white/[0.03] px-2 py-1">
                      <select className="input input-xs flex-1 min-w-[90px] text-xs" value={ex.exercise_id} onChange={e => updateExercise(i, 'exercise_id', Number(e.target.value))}>
                        <option value={0}>Pilih exercise...</option>
                        {exercises.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                      </select>
                      <input type="number" className="input input-xs text-xs text-center shrink-0" value={ex.target_sets} onChange={e => updateExercise(i, 'target_sets', Number(e.target.value))} min="1" title="Sets" style={{ width: '40px' }} />
                      <span className="text-gray-400 text-xs">×</span>
                      <input type="number" className="input input-xs text-xs text-center shrink-0" value={ex.target_reps} onChange={e => updateExercise(i, 'target_reps', Number(e.target.value))} min="1" title="Reps" style={{ width: '40px' }} />
                      <input type="number" className="input input-xs text-xs text-center shrink-0" value={ex.target_weight} onChange={e => updateExercise(i, 'target_weight', Number(e.target.value))} step="0.5" min="0" title="Berat (kg)" placeholder="kg" style={{ width: '48px' }} />
                      <button type="button" onClick={() => removeExercise(i)} className="text-red-400 hover:text-red-600 text-xs px-1 shrink-0">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" disabled={saving} className="btn btn-primary btn-full">
                {saving ? 'Menyimpan...' : editingPlan ? 'Simpan Perubahan' : 'Buat Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default WorkoutPlanPage
