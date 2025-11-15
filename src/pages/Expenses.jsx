import React, { useState } from 'react'
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import TransactionTable from '../components/TransactionTable.jsx'
import EditExpenseModal from '../components/EditExpenseModal.jsx'
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx'

export default function Expenses({ user, expenses }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteExpense, setDeleteExpense] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    setError('')
    setSaving(true)
    try {
      await addDoc(collection(db, 'users', user.uid, 'expenses'), {
        amount: numAmount,
        category,
        note,
        date: new Date(date),
        createdAt: serverTimestamp(),
      })
      setAmount('')
      setNote('')
      setDate(new Date().toISOString().slice(0, 10))
      setCategory('Food')
    } catch (err) {
      console.error(err)
      setError('Failed to save expense.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditClick = expense => {
    setSelectedExpense(expense)
    setEditOpen(true)
  }

  const handleSaveEdit = async updated => {
    const ref = doc(db, 'users', user.uid, 'expenses', updated.id)
    await updateDoc(ref, {
      amount: updated.amount,
      category: updated.category,
      note: updated.note,
      date: updated.date,
    })
  }

  const handleDeleteClick = expense => {
    setDeleteExpense(expense)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteExpense) return
    setDeleteLoading(true)
    try {
      const ref = doc(db, 'users', user.uid, 'expenses', deleteExpense.id)
      await deleteDoc(ref)
      setDeleteOpen(false)
      setDeleteExpense(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 sm:py-6">
      <div className="rounded-2xl bg-linear-to-r/srgb from-indigo-500 to-teal-400 p-4 text-white shadow-sm">
        <h1 className="text-lg font-semibold">Expenses</h1>
        <p className="mt-1 text-xs text-white/80">
          Add, edit, and delete your expenses.
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:p-6"
      >
        <h2 className="text-sm font-semibold text-slate-900">
          Add new expense
        </h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Housing</option>
              <option>Entertainment</option>
              <option>Bills</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Note
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Add expense'}
          </button>
        </div>
      </form>

      {/* All expenses table with actions */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-900">
          All expenses (latest first)
        </h2>
        <TransactionTable
          expenses={expenses}
          showActions
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </section>

      <EditExpenseModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        expense={selectedExpense}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        expense={deleteExpense}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  )
}
