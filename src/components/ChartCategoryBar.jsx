import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function ChartCategoryBar({ expenses }) {
  const data = useMemo(() => {
    const totals = {}
    for (const e of expenses) {
      const key = e.category || 'Uncategorized'
      totals[key] = (totals[key] || 0) + (e.amount || 0)
    }
    const labels = Object.keys(totals)
    const values = Object.values(totals)

    return {
      labels,
      datasets: [
        {
          label: 'Spending by category (฿)',
          data: values,
          backgroundColor: 'rgba(45, 212, 191, 0.6)', // teal-400 kind of
          borderColor: 'rgba(56, 189, 248, 1)', // sky-ish teal
          borderWidth: 1,
          borderRadius: 8,
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
        Not enough data for category chart yet.
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-xs font-semibold text-slate-900">
        Spending by category
      </h3>
      <div className="h-56">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
