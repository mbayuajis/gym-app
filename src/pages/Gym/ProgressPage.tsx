import { useState, useEffect } from 'react'
import { api } from '../../api'
import Chart from "react-apexcharts"
import { ApexOptions } from "apexcharts"
import ComponentCard from "../../components/common/ComponentCard"
import PageMeta from "../../components/common/PageMeta"

const MEASUREMENT_FIELDS = [
  { key: 'weight', label: 'Berat Badan', unit: 'kg', color: '#855747' },
  { key: 'chest', label: 'Lingkar Dada', unit: 'cm', color: '#D94040' },
  { key: 'waist', label: 'Lingkar Pinggang', unit: 'cm', color: '#E68A2E' },
  { key: 'arm', label: 'Lingkar Lengan', unit: 'cm', color: '#2E8B57' },
  { key: 'thigh', label: 'Lingkar Paha', unit: 'cm', color: '#2563EB' },
  { key: 'body_fat', label: 'Body Fat', unit: '%', color: '#7C3AED' },
]

function TrendChart({ data, field }) {
  const hasData = data.some(d => d[field.key] > 0)
  if (!hasData) return null

  const categories = data.map(d => {
    const dt = new Date(d.date + 'T00:00:00')
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  })
  const values = data.map(d => d[field.key])

  const options: ApexOptions = {
    colors: [field.color],
    chart: { fontFamily: "Outfit, sans-serif", height: 180, type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: [2] },
    markers: { size: 4, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    fill: { type: "gradient", gradient: { opacityFrom: 0.25, opacityTo: 0 } },
    dataLabels: { enabled: false },
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "11px", colors: ["#6B7280"] } }, title: { text: "" } },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (val: number) => `${val} ${field.unit}` } },
  }

  const series = [{ name: field.label, data: values }]

  return (
    <ComponentCard title={`${field.label} (${field.unit})`}>
      <Chart options={options} series={series} type="area" height={180} />
    </ComponentCard>
  )
}

function ProgressPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: '', chest: '', waist: '', arm: '', thigh: '', body_fat: '', notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadLogs = () => api.getProgress().then(data => { setLogs(data); setLoading(false) })
  useEffect(() => { loadLogs() }, [])

  const update = (f: string, v: any) => setForm(p => ({ ...p, [f]: v }))

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.date) { setError('Tanggal wajib diisi'); return }
    setSaving(true); setError('')
    try {
      await api.createProgress({
        date: form.date,
        weight: Number(form.weight) || 0,
        chest: Number(form.chest) || 0,
        waist: Number(form.waist) || 0,
        arm: Number(form.arm) || 0,
        thigh: Number(form.thigh) || 0,
        body_fat: Number(form.body_fat) || 0,
        notes: form.notes,
      })
      setForm({ date: new Date().toISOString().slice(0, 10), weight: '', chest: '', waist: '', arm: '', thigh: '', body_fat: '', notes: '' })
      setShowForm(false)
      loadLogs()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data ini?')) return
    await api.deleteProgress(id)
    loadLogs()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  const latest = logs.length > 0 ? logs[logs.length - 1] : null
  const first = logs.length > 0 ? logs[0] : null
  const getDiff = (key: string) => {
    if (!latest || !first) return 0
    return ((latest[key] || 0) - (first[key] || 0)).toFixed(1)
  }

  return (
    <>
      <PageMeta title="Progress" description="Progress tubuh" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Progress Tubuh</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
            + Catat Progress
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Tanggal</label>
                <input type="date" className="input w-full" value={form.date} onChange={e => update('date', e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Berat (kg)</label>
                <input type="number" className="input w-full" value={form.weight} onChange={e => update('weight', e.target.value)} step="0.1" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Dada (cm)</label>
                <input type="number" className="input w-full" value={form.chest} onChange={e => update('chest', e.target.value)} step="0.1" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Pinggang (cm)</label>
                <input type="number" className="input w-full" value={form.waist} onChange={e => update('waist', e.target.value)} step="0.1" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Lengan (cm)</label>
                <input type="number" className="input w-full" value={form.arm} onChange={e => update('arm', e.target.value)} step="0.1" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Paha (cm)</label>
                <input type="number" className="input w-full" value={form.thigh} onChange={e => update('thigh', e.target.value)} step="0.1" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Body Fat (%)</label>
                <input type="number" className="input w-full" value={form.body_fat} onChange={e => update('body_fat', e.target.value)} step="0.1" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Catatan</label>
              <input type="text" className="input w-full" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Opsional" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? 'Menyimpan...' : 'Simpan'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">Batal</button>
            </div>
          </form>
        )}

        {/* Summary cards */}
        {latest && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {MEASUREMENT_FIELDS.map(f => {
              const val = latest[f.key]
              const diff = getDiff(f.key)
              const numDiff = Number(diff)
              return val > 0 ? (
                <div key={f.key} className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="text-xs text-gray-500">{f.label}</div>
                  <div className="text-lg font-bold">{val} <span className="text-xs font-normal text-gray-400">{f.unit}</span></div>
                  <div className={`text-xs ${numDiff > 0 ? 'text-green-500' : numDiff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {numDiff > 0 ? '+' : ''}{diff} sejak awal
                  </div>
                </div>
              ) : null
            })}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEASUREMENT_FIELDS.map(f => (
            <TrendChart key={f.key} data={logs} field={f} />
          ))}
        </div>

        {/* History table */}
        {logs.length > 0 && (
          <ComponentCard title="Riwayat Progress">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500">
                    <th className="py-2 px-2">Tanggal</th>
                    {MEASUREMENT_FIELDS.map(f => <th key={f.key} className="py-2 px-2">{f.label}</th>)}
                    <th className="py-2 px-2">Catatan</th>
                    <th className="py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {[...logs].reverse().map(log => (
                    <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-2 text-xs">
                        {new Date(log.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      {MEASUREMENT_FIELDS.map(f => (
                        <td key={f.key} className="py-2 px-2 text-xs">{log[f.key] > 0 ? log[f.key] : '-'}</td>
                      ))}
                      <td className="py-2 px-2 text-xs text-gray-400 max-w-[100px] truncate">{log.notes || '-'}</td>
                      <td className="py-2 px-2">
                        <button onClick={() => handleDelete(log.id)} className="text-red-400 hover:text-red-600 text-xs">&times;</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        )}
      </div>
    </>
  )
}

export default ProgressPage
