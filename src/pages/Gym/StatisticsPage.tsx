import { useState, useEffect } from 'react'
import { api } from '../../api'
import Chart from "react-apexcharts"
import { ApexOptions } from "apexcharts"
import ComponentCard from "../../components/common/ComponentCard"
import PageMeta from "../../components/common/PageMeta"

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    </div>
  )
}

function WorkoutWeekChart({ data }) {
  const categories = data.map(d => {
    const dt = new Date(d.week_start + 'T00:00:00')
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  })
  const counts = data.map(d => d.count)

  const options: ApexOptions = {
    colors: ["#855747"],
    chart: { fontFamily: "Outfit, sans-serif", type: "bar", height: 220, toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: "39%", borderRadius: 5, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false } },
    legend: { show: false },
    yaxis: { labels: { style: { fontSize: "12px", colors: ["#6B7280"] } }, title: { text: "" } },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (val: number) => `${val} workout` } },
  }

  const series = [{ name: "Workout", data: counts }]

  return (
    <ComponentCard title="Workout per Minggu">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[500px]">
          <Chart options={options} series={series} type="bar" height={220} />
        </div>
      </div>
    </ComponentCard>
  )
}

function VolumeChart({ data }) {
  const categories = data.map(d => {
    const dt = new Date(d.date + 'T00:00:00')
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  })
  const volumes = data.map(d => d.total_volume)

  const options: ApexOptions = {
    colors: ["#855747"],
    chart: { fontFamily: "Outfit, sans-serif", height: 220, type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: [2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0 } },
    markers: { size: 4, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    dataLabels: { enabled: false },
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "12px", colors: ["#6B7280"] }, formatter: (v) => v >= 1000 ? (v / 1000) + 'k' : v }, title: { text: "" } },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (val: number) => `${val} kg` } },
  }

  const series = [{ name: "Volume", data: volumes }]

  return (
    <ComponentCard title="Volume per Workout">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[500px]">
          <Chart options={options} series={series} type="area" height={220} />
        </div>
      </div>
    </ComponentCard>
  )
}

function CategoryChart({ data }) {
  const maxCount = Math.max(...data.map(c => c.count), 1)
  return (
    <ComponentCard title="Kategori yang Sering Dilatih">
      <div className="space-y-3">
        {data.map(cat => (
          <div key={cat.category} className="flex items-center gap-3">
            <span className="text-sm font-medium w-24 truncate">{cat.category}</span>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-brand-500 rounded-full h-2.5 transition-all"
                style={{ width: `${(cat.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">{cat.count}x</span>
          </div>
        ))}
      </div>
    </ComponentCard>
  )
}

function StatisticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getStats()
      .then(data => { setStats(data); setError(null) })
      .catch(err => setError(err.message || 'Gagal memuat statistik'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-400">Gagal memuat statistik</p>
      </div>
    )
  }

  const totalWorkouts = stats.workoutVolumes.length
  const totalExercises = stats.workoutVolumes.reduce((s, w) => s + w.exercise_count, 0)
  const totalSets = stats.workoutVolumes.reduce((s, w) => s + w.set_count, 0)
  const totalVolume = stats.workoutVolumes.reduce((s, w) => s + w.total_volume, 0)
  const avgVolume = totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0

  return (
    <>
      <PageMeta title="Statistik" description="Ringkasan statistik latihan" />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Statistik</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Workout" value={totalWorkouts} icon="🏋️" />
          <StatCard label="Total Gerakan" value={totalExercises} icon="📋" />
          <StatCard label="Total Set" value={totalSets} icon="🔢" />
          <StatCard label="Total Volume" value={totalVolume.toLocaleString()} icon="📊" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Rata-rata Volume" value={avgVolume.toLocaleString()} icon="📈" />
          <StatCard label="Minggu Ini" value={stats.weeklyWorkouts.filter(w => w.count > 0).length} icon="📅" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {stats.weeklyWorkouts.some(w => w.count > 0) && (
            <WorkoutWeekChart data={stats.weeklyWorkouts} />
          )}
          {stats.workoutVolumes.some(w => w.total_volume > 0) && (
            <VolumeChart data={stats.workoutVolumes} />
          )}
        </div>

        {stats.categoryDist.length > 0 && (
          <CategoryChart data={stats.categoryDist} />
        )}
      </div>
    </>
  )
}

export default StatisticsPage
