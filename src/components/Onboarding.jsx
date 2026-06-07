import { useState } from 'react'
import { api } from '../api'

const STEPS = ['Data Diri', 'Tubuh & Target', 'Preferensi']

const LEVELS = [
  { value: 'pemula', label: 'Pemula' },
  { value: 'menengah', label: 'Menengah' },
  { value: 'mahir', label: 'Mahir' },
]

const GOALS = [
  { value: 'turun_berat', label: 'Menurunkan Berat Badan' },
  { value: 'naik_otot', label: 'Menambah Massa Otot' },
  { value: 'naik_kekuatan', label: 'Meningkatkan Kekuatan' },
  { value: 'jaga_kebugaran', label: 'Menjaga Kebugaran' },
  { value: 'naik_stamina', label: 'Meningkatkan Stamina' },
]

const LOCATIONS = [
  { value: 'gym', label: 'Gym' },
  { value: 'rumah', label: 'Rumah' },
  { value: 'outdoor', label: 'Outdoor' },
]

const EQUIPMENT_OPTIONS = [
  'Barbel', 'Dumbbel', 'Kettlebell', 'Resistance Band',
  'Pull Up Bar', 'Bench', 'Cable Machine', 'Mesin Gym',
  'Matras', 'TRX', 'Medicine Ball', 'Jump Rope',
]

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    target_weight: '',
    level: '',
    goal: '',
    frequency: '',
    location: '',
    equipment: [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const toggleEquipment = (item) => {
    setForm(f => ({
      ...f,
      equipment: f.equipment.includes(item)
        ? f.equipment.filter(e => e !== item)
        : [...f.equipment, item],
    }))
  }

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.age > 0 && form.gender
    if (step === 1) return form.height > 0 && form.weight > 0 && form.level && form.goal
    if (step === 2) return form.frequency > 0 && form.location
    return true
  }

  const next = () => {
    if (!canNext()) return
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const prev = () => setStep(s => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    try {
      await api.submitOnboarding({
        ...form,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        target_weight: Number(form.target_weight) || 0,
        frequency: Number(form.frequency),
      })
      onComplete()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>

          {/* Step 0: Data Diri */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Data Diri</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input type="text" className="input w-full" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nama kamu" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Usia</label>
                <input type="number" className="input w-full" value={form.age} onChange={e => update('age', e.target.value)} min="10" max="100" placeholder="Contoh: 24" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <div className="flex gap-3">
                  {['Laki-laki', 'Perempuan'].map(g => (
                    <button key={g} type="button" onClick={() => update('gender', g)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition ${form.gender === g ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Tubuh & Target */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tubuh & Target</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Tinggi Badan (cm)</label>
                  <input type="number" className="input w-full" value={form.height} onChange={e => update('height', e.target.value)} min="50" max="300" placeholder="170" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Berat Badan (kg)</label>
                  <input type="number" className="input w-full" value={form.weight} onChange={e => update('weight', e.target.value)} min="20" max="300" step="0.5" placeholder="70" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Berat Badan (kg, opsional)</label>
                <input type="number" className="input w-full" value={form.target_weight} onChange={e => update('target_weight', e.target.value)} min="20" max="300" step="0.5" placeholder="Kosongkan jika belum tahu" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level Latihan</label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map(l => (
                    <button key={l.value} type="button" onClick={() => update('level', l.value)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition ${form.level === l.value ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tujuan Fitness</label>
                <div className="grid grid-cols-1 gap-2">
                  {GOALS.map(g => (
                    <button key={g.value} type="button" onClick={() => update('goal', g.value)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition text-left ${form.goal === g.value ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferensi */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Preferensi Latihan</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Frekuensi Latihan per Minggu</label>
                <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => update('frequency', n)}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition ${form.frequency === n ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                  {n}x
                </button>
              ))}
            </div>
          </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lokasi Latihan</label>
                <div className="grid grid-cols-3 gap-2">
                  {LOCATIONS.map(l => (
                    <button key={l.value} type="button" onClick={() => update('location', l.value)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition ${form.location === l.value ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alat yang Tersedia</label>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT_OPTIONS.map(eq => (
                    <button key={eq} type="button" onClick={() => toggleEquipment(eq)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${form.equipment.includes(eq) ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <button type="button" onClick={prev} disabled={step === 0}
              className="btn btn-outline btn-sm disabled:opacity-30">Kembali</button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} disabled={!canNext()}
                className="btn btn-primary btn-sm disabled:opacity-50">Lanjut</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={saving || !canNext()}
                className="btn btn-primary btn-sm disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Selesai'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
