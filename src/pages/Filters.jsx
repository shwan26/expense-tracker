import React, { useMemo, useState } from 'react'
import TransactionTable from '../components/TransactionTable.jsx'
import { applySort, applyTimeFilter, calcSummary } from '../utils/expenseUtils.js'
import SummaryCard from '../components/SummaryCard.jsx'

export default function FiltersPage({ expenses }) {
  const [timeFilter, setTimeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date_desc')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dayFilter, setDayFilter] = useState('all')
  const [searchText, setSearchText] = useState('')

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set()
    expenses.forEach(e => set.add(e.category || 'Uncategorized'))
    return ['all', ...Array.from(set)]
  }, [expenses])

  // 1️⃣ Apply time filter
  const afterTimeFilter = useMemo(() => {
    return applyTimeFilter(expenses, timeFilter)
  }, [expenses, timeFilter])

  // 2️⃣ Apply category filter
  const afterCategoryFilter = useMemo(() => {
    if (categoryFilter === 'all') return afterTimeFilter
    return afterTimeFilter.filter(e => (e.category || 'Uncategorized') === categoryFilter)
  }, [afterTimeFilter, categoryFilter])

  // 3️⃣ Apply day filter
  const afterDayFilter = useMemo(() => {
    if (dayFilter === 'all') return afterCategoryFilter

    const now = new Date()
    return afterCategoryFilter.filter(e => {
      const d = e.date
      const diff = (now - d) / (1000 * 60 * 60 * 24)

      switch (dayFilter) {
        case 'today':
          return d.toDateString() === now.toDateString()
        case 'yesterday':
          return diff >= 1 && diff < 2
        case 'last7':
          return diff < 7
        case 'last30':
          return diff < 30
        default:
          return true
      }
    })
  }, [afterCategoryFilter, dayFilter])

  // 4️⃣ Search filter
  const afterSearchFilter = useMemo(() => {
    if (!searchText.trim()) return afterDayFilter
    const text = searchText.toLowerCase()
    return afterDayFilter.filter(e =>
      (e.note || '').toLowerCase().includes(text)
    )
  }, [afterDayFilter, searchText])

  // 5️⃣ Apply sorting LAST
  const filteredSorted = useMemo(() => {
    return applySort(afterSearchFilter, sortBy)
  }, [afterSearchFilter, sortBy])

  const { total } = useMemo(() => calcSummary(filteredSorted), [filteredSorted])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 sm:py-6">

      {/* Page title */}
      <div className="rounded-2xl bg-linear-to-r/srgb from-indigo-500 to-teal-400 p-4 text-white shadow">
        <h1 className="text-lg font-semibold">Filters & Sorting</h1>
        <p className="text-xs text-white/70">
          Refine your expenses and find insights easily.
        </p>
      </div>

      {/* Combined Filter Row */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">

        {/* Search Bar */}
        <div className="lg:col-span-1">
          <label className="text-xs font-semibold text-slate-800">Search Notes</label>
          <input
            type="text"
            placeholder="Search notes..."
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-800">Category</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Day Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-800">Day Range</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            value={dayFilter}
            onChange={e => setDayFilter(e.target.value)}
          >
            <option value="all">All Days</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
          </select>
        </div>

        {/* Sorting */}
        <div>
          <label className="text-xs font-semibold text-slate-800">Sort By</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard
          title="Filtered Total"
          value={`฿${total.toFixed(2)}`}
          subtitle="Matches all filters applied"
        />
        <SummaryCard
          title="Transactions"
          value={filteredSorted.length}
          subtitle="Rows displayed below"
          icon="📄"
        />
      </div>

      {/* Table */}
      <TransactionTable expenses={filteredSorted} />
    </div>
  )
}
