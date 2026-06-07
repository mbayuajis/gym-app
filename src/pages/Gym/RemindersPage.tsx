import { useState, useEffect } from 'react'
import { api } from '../../api'
import PageMeta from "../../components/common/PageMeta"
import ComponentCard from "../../components/common/ComponentCard"

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
const DAYS_EN = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const REMINDER_TYPES = [
  { value: 'workout', label: 'Workout', icon: '🏋️' },
  { value: 'weight', label: 'Update Berat Badan', icon: '⚖️' },
  { value: 'photo', label: 'Progress Photo', icon: '📷' },
]

function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    type: 'workout',
    day: DAYS_EN[0],
    time: '18:00',
    enabled: true,
  })

  const loadReminders = () => api.getReminders().then(data => { setReminders(data); setLoading(false) })
  useEffect(() => { loadReminders() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await api.createReminder(form)
      setForm({ type: 'workout', day: DAYS_EN[0], time: '18:00', enabled: true })
      setShowForm(false)
      loadReminders()
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const toggleEnabled = async (r: any) => {
    await api.updateReminder(r.id, { enabled: !r.enabled })
    loadReminders()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus reminder ini?')) return
    await api.deleteReminder(id)
    loadReminders()
  }

  const dayLabel = (day: string) => {
    const idx = DAYS_EN.indexOf(day)
    return idx >= 0 ? DAYS[idx] : day
  }

  const typeLabel = (type: string) => {
    const t = REMINDER_TYPES.find(r => r.value === type)
    return t ? `${t.icon} ${t.label}` : type
  }

  // Check and request notification permission
  const requestNotification = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  useEffect(() => { requestNotification() }, [])

  // Simple interval-based reminder check (runs every minute when page is open)
  useEffect(() => {
    if (reminders.length === 0) return
    const enabledReminders = reminders.filter(r => r.enabled)
    if (enabledReminders.length === 0) return

    const check = () => {
      const now = new Date()
      const nowDay = now.getDay() // 0=Sun, 1=Mon...
      const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      for (const r of enabledReminders) {
        const dayIdx = DAYS_EN.indexOf(r.day)
        if (dayIdx === (nowDay + 6) % 7 && r.time === nowTime) { // +6 because DAYS_EN starts Mon
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('YuJiM', {
              body: `Waktunya ${REMINDER_TYPES.find(t => t.value === r.type)?.label || r.type}!`,
              icon: '/favicon.svg',
            })
          }
        }
      }
    }

    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [reminders])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  return (
    <>
      <PageMeta title="Reminder" description="Pengingat latihan" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Reminder</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
            + Tambah Reminder
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipe</label>
              <div className="grid grid-cols-3 gap-2">
                {REMINDER_TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => setForm(f => ({ ...f, type: t.value }))}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition ${form.type === t.value ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-500'}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hari</label>
                <select className="input w-full" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
                  {DAYS_EN.map((d, i) => <option key={d} value={d}>{DAYS[i]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jam</label>
                <input type="time" className="input w-full" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? 'Menyimpan...' : 'Simpan'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">Batal</button>
            </div>
          </form>
        )}

        {reminders.length === 0 && !showForm && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-gray-400 dark:text-gray-500">Belum ada reminder. Tambah reminder untuk tetap konsisten!</p>
          </div>
        )}

        {reminders.length > 0 && (
          <ComponentCard title="Daftar Reminder">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500">
                    <th className="py-3 px-3">Tipe</th>
                    <th className="py-3 px-3">Hari</th>
                    <th className="py-3 px-3">Jam</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.map(r => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-3">{typeLabel(r.type)}</td>
                      <td className="py-3 px-3">{dayLabel(r.day)}</td>
                      <td className="py-3 px-3 font-mono">{r.time}</td>
                      <td className="py-3 px-3">
                        <button onClick={() => toggleEnabled(r)}
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            r.enabled
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                          {r.enabled ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 text-xs">&times;</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        )}

        {'Notification' in window && Notification.permission === 'default' && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-xs text-gray-500">
              🔔 Aktifkan notifikasi browser untuk menerima reminder latihan.
              <button onClick={requestNotification} className="ml-2 text-brand-500 hover:underline">Aktifkan Notifikasi</button>
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default RemindersPage
