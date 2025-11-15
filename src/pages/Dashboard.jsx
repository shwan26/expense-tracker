import React, { useMemo, useState } from 'react'
import TimeFilters from '../components/TimeFilters.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import TransactionTable from '../components/TransactionTable.jsx'
import { applySort, applyTimeFilter, calcSummary } from '../utils/expenseUtils.js'
import ChartCategoryBar from '../components/ChartCategoryBar.jsx'
import ChartSpendingLine from '../components/ChartSpendingLine.jsx'

export default function Dashboard({ expenses }) {
  const [timeFilter, setTimeFilter] = useState('month')
  const [sortBy, setSortBy] = useState('date_desc')

  const filteredSorted = useMemo(() => {
    const filtered = applyTimeFilter(expenses, timeFilter)
    return applySort(filtered, sortBy)
  }, [expenses, timeFilter, sortBy])

  const summary = useMemo(
    () => calcSummary(filteredSorted),
    [filteredSorted],
  )

  const { total, byCategory } = summary
  const topCategoryEntry = Object.entries(byCategory).sort(
    (a, b) => b[1] - a[1],
  )[0]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 sm:py-6">
      {/* Gradient header like your style */}
      <div className="rounded-2xl bg-linear-to-r/srgb from-indigo-500 to-teal-400 p-4 text-white shadow-sm">
        <h1 className="text-lg font-semibold">Dashboard overview</h1>
        <p className="mt-1 text-xs text-white/80">
          Track your spending, categories, and trends over time.
        </p>
      </div>

      <TimeFilters
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Summary cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard
          title="Total spent"
          value={`฿${total.toFixed(2)}`}
          subtitle="Selected time period"
          icon="💸"
        />
        <SummaryCard
          title="Transactions"
          value={filteredSorted.length}
          subtitle={`From ${expenses.length} total expenses`}
          icon="🧾"
        />
        <SummaryCard
          title="Top category"
          value={topCategoryEntry ? topCategoryEntry[0] : '—'}
          subtitle={
            topCategoryEntry
              ? `฿${topCategoryEntry[1].toFixed(2)} spent`
              : 'No expenses yet'
          }
          icon="📊"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-3 md:grid-cols-2">
        <ChartCategoryBar expenses={filteredSorted} />
        <ChartSpendingLine expenses={filteredSorted} />
      </div>

      {/* Recent transactions */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent transactions
          </h2>
          <p className="text-xs text-slate-500">
            {filteredSorted.length} items
          </p>
        </div>
        <TransactionTable expenses={filteredSorted} />
      </section>
    </div>
  )
}
