import React from 'react'

const buttons = [
  { id: 'all', label: 'All time' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
]

export default function TimeFilters({ timeFilter, setTimeFilter, sortBy, setSortBy }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {buttons.map(btn => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setTimeFilter(btn.id)}
            className={
              'rounded-full px-3 py-1 text-xs font-medium ' +
              (timeFilter === btn.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
            }
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Sort by:</span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="amount_desc">Amount ↓</option>
          <option value="amount_asc">Amount ↑</option>
        </select>
      </div>
    </div>
  )
}
