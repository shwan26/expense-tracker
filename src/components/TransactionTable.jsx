import React from 'react'

export default function TransactionTable({
  expenses,
  showActions = false,
  onEdit,
  onDelete,
}) {
  if (!expenses.length) {
    return (
      <div className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-sm">
        No expenses for this period yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2 text-right">Amount</th>
              <th className="px-4 py-2">Note</th>
              {showActions && <th className="px-4 py-2 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr
                key={e.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-4 py-2 text-xs text-slate-600">
                  {e.date.toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-xs font-medium text-slate-800">
                  {e.category || 'Uncategorized'}
                </td>
                <td className="px-4 py-2 text-right text-xs font-semibold text-slate-900">
                  ฿{e.amount.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-xs text-slate-600">
                  {e.note || '—'}
                </td>
                {showActions && (
                  <td className="px-4 py-2 text-right text-xs">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(e)}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(e)}
                        className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
