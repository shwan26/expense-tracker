import React, { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { Routes, Route, Navigate } from 'react-router-dom'
import { auth } from './firebase'
import Navbar from './components/Navbar.jsx'
import { useExpenses } from './hooks/useExpenses.js'
import Dashboard from './pages/Dashboard.jsx'
import Expenses from './pages/Expenses.jsx'
import FiltersPage from './pages/Filters.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import SettingsPage from './pages/SettingsPage.jsx'


// ---------- AuthScreen (keep as you wrote it) ----------
function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setError('')
    setInfo('')

    if (!email.trim()) {
      setError('Please enter your email above first.')
      return
    }

    setResetLoading(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setInfo('Password reset email sent. Please check your inbox.')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to send password reset email.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">
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
            {!isRegister && (
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="mt-1 text-xs font-medium text-indigo-600 hover:underline disabled:opacity-60"
              >
                {resetLoading ? 'Sending reset email...' : 'Forgot password?'}
              </button>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}
          {!error && info && (
            <p className="text-xs text-emerald-600">
              {info}
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
          {isRegister ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(v => !v)
              setError('')
              setInfo('')
            }}
            className="font-medium text-indigo-600 hover:underline"
          >
            {isRegister ? 'Sign in' : 'Create one'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------- MAIN APP ----------
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

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Routes>
        {/* 🔓 PUBLIC ROUTE: reset password (can be used without login) */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🔒 PROTECTED ROUTES: need login, but we still show Navbar etc. */}
        <Route
          path="/"
          element={
            user ? (
              <>
                <Navbar user={user} />
                {expensesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="rounded-2xl bg-white px-6 py-3 text-sm text-slate-600 shadow">
                      Loading expenses...
                    </div>
                  </div>
                ) : (
                  <Dashboard expenses={expenses} />
                )}
              </>
            ) : (
              <AuthScreen />
            )
          }
        />

        <Route
          path="/expenses"
          element={
            user ? (
              <>
                <Navbar user={user} />
                {expensesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="rounded-2xl bg-white px-6 py-3 text-sm text-slate-600 shadow">
                      Loading expenses...
                    </div>
                  </div>
                ) : (
                  <Expenses user={user} expenses={expenses} />
                )}
              </>
            ) : (
              <AuthScreen />
            )
          }
        />

        <Route
          path="/filters"
          element={
            user ? (
              <>
                <Navbar user={user} />
                {expensesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="rounded-2xl bg-white px-6 py-3 text-sm text-slate-600 shadow">
                      Loading expenses...
                    </div>
                  </div>
                ) : (
                  <FiltersPage expenses={expenses} />
                )}
              </>
            ) : (
              <AuthScreen />
            )
          }
        />

        <Route
          path="/settings"
          element={
            <>
              <Navbar user={user} />
              <SettingsPage user={user} />
            </>
          }
        />


        {/* Catch-all: if unknown route, send to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
