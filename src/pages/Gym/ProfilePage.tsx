import { useState, useEffect } from 'react'
import { api } from '../../api'

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

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

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

  useEffect(() => {
    api.getProfile().then(data => {
      setProfile(data)
      setForm({
        name: data.name || '',
        age: data.age || '',
        gender: data.gender || '',
        height: data.height || '',
        weight: data.weight || '',
        target_weight: data.target_weight || '',
        level: data.level || '',
        goal: data.goal || '',
        frequency: data.frequency || '',
        location: data.location || '',
        equipment: data.equipment || [],
      })
      setLoading(false)
    })
  }, [])

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const toggleEquipment = (item) => {
    setForm(f => ({
      ...f,
      equipment: f.equipment.includes(item)
        ? f.equipment.filter(e => e !== item)
        : [...f.equipment, item],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await api.updateProfile({
        ...form,
        age: Number(form.age) || 0,
        height: Number(form.height) || 0,
        weight: Number(form.weight) || 0,
        target_weight: Number(form.target_weight) || 0,
        frequency: Number(form.frequency) || 0,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="card-title">Profil Fitness</h2>

      <div className="card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input type="text" className="input w-full" value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Usia</label>
            <input type="number" className="input w-full" value={form.age} onChange={e => update('age', e.target.value)} min="10" max="100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <div className="flex gap-3">
            {['Laki-laki', 'Perempuan'].map(g => (
              <button key={g} type="button" onClick={() => update('gender', g)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${form.gender === g ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tinggi (cm)</label>
            <input type="number" className="input w-full" value={form.height} onChange={e => update('height', e.target.value)} min="50" max="300" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Berat (kg)</label>
            <input type="number" className="input w-full" value={form.weight} onChange={e => update('weight', e.target.value)} min="20" max="300" step="0.5" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Berat</label>
            <input type="number" className="input w-full" value={form.target_weight} onChange={e => update('target_weight', e.target.value)} min="20" max="300" step="0.5" placeholder="-" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Level Latihan</label>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map(l => (
              <button key={l.value} type="button" onClick={() => update('level', l.value)}
                className={`py-2 rounded-lg border text-sm font-medium transition ${form.level === l.value ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tujuan Fitness</label>
          <div className="grid grid-cols-1 gap-2">
            {GOALS.map(g => (
              <button key={g.value} type="button" onClick={() => update('goal', g.value)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition text-left ${form.goal === g.value ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Frekuensi / Minggu</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => update('frequency', n)}
                  className={`py-2 rounded-lg border text-sm font-medium transition ${form.frequency === n ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                  {n}x
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Lokasi</label>
            <div className="grid grid-cols-3 gap-2">
              {LOCATIONS.map(l => (
                <button key={l.value} type="button" onClick={() => update('location', l.value)}
                  className={`py-2 rounded-lg border text-sm font-medium transition ${form.location === l.value ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Alat Tersedia</label>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map(eq => (
              <button key={eq} type="button" onClick={() => toggleEquipment(eq)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${form.equipment.includes(eq) ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                {eq}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="button" onClick={handleSave} disabled={saving}
          className="btn btn-primary btn-full">
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan ✓' : 'Simpan Profil'}
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
