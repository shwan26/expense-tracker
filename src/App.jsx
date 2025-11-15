import React, { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { Routes, Route } from 'react-router-dom'
import { auth } from './firebase'
import Navbar from './components/Navbar.jsx'
import { useExpenses } from './hooks/useExpenses.js'
import Dashboard from './pages/Dashboard.jsx'
import Expenses from './pages/Expenses.jsx'
import FiltersPage from './pages/Filters.jsx'

// Simple auth screen
function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
          Expense Tracker
        </h1>
        
        <p className="mb-4 text-center text-sm text-slate-500">
          {isRegister ? 'Create your account' : 'Sign in to continue'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isRegister ? 'Sign up' : 'Sign in'}
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-slate-500">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(v => !v)}
            className="font-medium text-indigo-600 hover:underline"
          >
            {isRegister ? 'Sign in' : 'Create one'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setInitialLoading(false)
    })
    return () => unsub()
  }, [])

  const { expenses, loading: expensesLoading } = useExpenses(user)

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm text-slate-600 shadow">
          Loading...
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar user={user} />
      <main className="flex-1">
        {expensesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="rounded-2xl bg-white px-6 py-3 text-sm text-slate-600 shadow">
              Loading expenses...
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard expenses={expenses} />} />
            <Route
              path="/expenses"
              element={<Expenses user={user} expenses={expenses} />}
            />
            <Route
              path="/filters"
              element={<FiltersPage expenses={expenses} />}
            />
          </Routes>
        )}
      </main>
    </div>
  )
}
