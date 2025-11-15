import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

export default function ChartSpendingLine({ expenses }) {
  const data = useMemo(() => {
    if (!expenses.length) {
      return { labels: [], datasets: [] }
    }

    // Group by date (YYYY-MM-DD)
    const map = {}
    for (const e of expenses) {
      const d = e.date
      const key = d.toISOString().slice(0, 10)
      map[key] = (map[key] || 0) + (e.amount || 0)
    }

    const labels = Object.keys(map).sort()
    const values = labels.map(k => map[k])

    return {
      labels,
      datasets: [
        {
          label: 'Daily spending (฿)',
          data: values,
          fill: true,
          tension: 0.4,
          borderColor: 'rgba(56, 189, 248, 1)', // teal-ish
          backgroundColor: 'rgba(45, 212, 191, 0.15)',
          pointRadius: 3,
          pointBackgroundColor: 'rgba(56, 189, 248, 1)',
        },
      ],
    }
  }, [expenses])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `฿${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { font: { size: 10 } },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
      },
    },
  }

  if (!data.labels.length) {
    return (
      <div className="rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-sm">
        Not enough data for trend chart yet.
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-xs font-semibold text-slate-900">
        Daily spending trend
      </h3>
      <div className="h-56">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
