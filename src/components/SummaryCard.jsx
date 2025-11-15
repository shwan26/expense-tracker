import React from 'react'

export default function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon ?? '💰'}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
      {subtitle && (
        <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
  )
}
