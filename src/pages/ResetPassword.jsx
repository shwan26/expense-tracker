import { useEffect, useState } from "react"
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth"
import { auth } from "../firebase"
import { useSearchParams, Link } from "react-router-dom"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const oobCode = searchParams.get("oobCode")

  const [loading, setLoading] = useState(true)
  const [valid, setValid] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Step 1: Validate the reset code
  useEffect(() => {
    async function checkCode() {
      try {
        const email = await verifyPasswordResetCode(auth, oobCode)
        setEmail(email)
        setValid(true)
      } catch (err) {
        setError("Invalid or expired reset link.")
      } finally {
        setLoading(false)
      }
    }

    if (oobCode) checkCode()
  }, [oobCode])

  // Step 2: Submit new password
  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      await confirmPasswordReset(auth, oobCode, password)
      setSuccess("Password has been reset successfully. You can now log in.")
    } catch (err) {
      setError("Failed to reset password. The link may be expired.")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-6 py-4 shadow text-slate-600">Checking reset link...</div>
      </div>
    )
  }

  if (!valid) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="max-w-md rounded-xl bg-white px-8 py-6 shadow text-center">
          <p className="text-red-500 font-semibold text-sm">{error}</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 font-medium">Go back</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-xl font-bold text-slate-900">
          Reset Your Password
        </h1>

        <p className="mb-4 text-center text-sm text-slate-600">
          Resetting password for: <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Reset Password
          </button>
        </form>

        {success && (
          <div className="text-center mt-4">
            <Link to="/" className="text-indigo-600 text-sm font-medium">Return to Login</Link>
          </div>
        )}
      </div>
    </div>
  )
}
