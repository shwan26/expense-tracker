// Time helpers
export function startOfToday() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function startOfWeek() {
  const d = new Date()
  const day = d.getDay()
  const diff = (day === 0 ? 6 : day - 1) // Monday as first day
  const monday = new Date(d)
  monday.setDate(d.getDate() - diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function startOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

// Filtering by time
export function applyTimeFilter(expenses, timeFilter) {
  if (timeFilter === 'all') return expenses
  const now = new Date()

  if (timeFilter === 'today') {
    const start = startOfToday()
    return expenses.filter(e => e.date >= start && e.date <= now)
  }
  if (timeFilter === 'week') {
    const start = startOfWeek()
    return expenses.filter(e => e.date >= start && e.date <= now)
  }
  if (timeFilter === 'month') {
    const start = startOfMonth()
    return expenses.filter(e => e.date >= start && e.date <= now)
  }

  return expenses
}

// Sorting
export function applySort(expenses, sortBy) {
  const sorted = [...expenses]
  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return b.date - a.date
      case 'date_asc':
        return a.date - b.date
      case 'amount_desc':
        return b.amount - a.amount
      case 'amount_asc':
        return a.amount - b.amount
      default:
        return 0
    }
  })
  return sorted
}

// Summary for dashboard
export function calcSummary(expenses) {
  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const byCategory = {}
  for (const e of expenses) {
    const key = e.category || 'Uncategorized'
    byCategory[key] = (byCategory[key] || 0) + (e.amount || 0)
  }
  return { total, byCategory }
}
