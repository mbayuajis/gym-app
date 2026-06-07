import { useState, useEffect } from 'react'
import { api } from '../../api'
import PageMeta from "../../components/common/PageMeta"
import ComponentCard from "../../components/common/ComponentCard"

type Record = {
  exercise_id: number
  exercise_name: string
  category: string
  best_weight?: number
  best_reps?: number
  best_volume?: number
  achieved_date: string
  reps_weight?: number
}

type PRData = {
  bestWeight: Record[]
  bestVolume: Record[]
  bestReps: Record[]
}

const TABS = [
  { key: 'bestWeight', label: 'Beban Tertinggi' },
  { key: 'bestReps', label: 'Reps Terbanyak' },
  { key: 'bestVolume', label: 'Volume Tertinggi' },
]

function PersonalRecordsPage() {
  const [data, setData] = useState<PRData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('bestWeight')

  useEffect(() => {
    api.getPersonalRecords().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  if (!data) return null

  const records = data[tab as keyof PRData] || []

  return (
    <>
      <PageMeta title="Personal Records" description="Pencapaian terbaik" />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Personal Records</h2>

        {/* Tabs */}
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 dark:bg-gray-900 p-0.5 w-fit">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 font-medium rounded-md text-theme-sm transition ${
                tab === t.key
                  ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {records.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-gray-400 dark:text-gray-500">Belum ada data. Mulai catat workout untuk melihat PR!</p>
          </div>
        ) : (
          <ComponentCard title={TABS.find(t => t.key === tab)?.label || ''}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500">
                    <th className="py-3 px-3">Exercise</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3 text-right">Pencapaian</th>
                    <th className="py-3 px-3 text-right">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={r.exercise_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-medium">{r.exercise_name}</td>
                      <td className="py-3 px-3 text-xs text-gray-500">{r.category}</td>
                      <td className="py-3 px-3 text-right font-bold text-brand-500">
                        {tab === 'bestWeight' && `${r.best_weight} kg x ${r.best_reps} reps`}
                        {tab === 'bestReps' && `${r.best_reps} reps${r.reps_weight > 0 ? ` @ ${r.reps_weight} kg` : ''}`}
                        {tab === 'bestVolume' && `${(r.best_volume || 0).toLocaleString()} kg`}
                      </td>
                      <td className="py-3 px-3 text-right text-xs text-gray-500">
                        {r.achieved_date ? new Date(r.achieved_date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        )}

        {records.length > 0 && tab === 'bestWeight' && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-xs text-gray-500">
              💡 Personal record dihitung secara otomatis dari data workout. Terus catat latihanmu untuk memecahkan record!
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default PersonalRecordsPage
