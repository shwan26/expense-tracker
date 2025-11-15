import { useEffect, useState } from "react"
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { auth, db } from "../firebase"
import { useNavigate } from "react-router-dom"
import { Dialog } from "@headlessui/react"
import { createAvatar } from "@dicebear/core"
import { adventurer } from "@dicebear/collection"
import {
  collection,
  deleteDoc,
  getDocs,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore"
import "./../index.css"

export default function SettingsPage({ user }) {
  const navigate = useNavigate()

  const [avatarSeed, setAvatarSeed] = useState(user.email) // default before loading Firestore
  const [avatarSvg, setAvatarSvg] = useState("")
  const [loadingAvatar, setLoadingAvatar] = useState(true)

  // Modals
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const [deleteExpensesOpen, setDeleteExpensesOpen] = useState(false)

  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ⭐ 1️⃣ Load saved avatar seed from Firestore
  useEffect(() => {
    async function loadAvatar() {
      const userRef = doc(db, "users", user.uid)
      const snap = await getDoc(userRef)

      if (snap.exists() && snap.data().avatarSeed) {
        setAvatarSeed(snap.data().avatarSeed)
      }

      generateAvatar(snap.exists() ? snap.data().avatarSeed : user.email)
      setLoadingAvatar(false)
    }

    loadAvatar()
  }, [])

  // ⭐ Generate avatar SVG from seed
  const generateAvatar = (seed) => {
    const svg = createAvatar(adventurer, {
      seed: seed,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
    }).toString()

    setAvatarSvg(svg)

    // Animate avatar
    const img = document.getElementById("avatar-img")
    if (img) {
      img.classList.remove("animate-avatar")
      void img.offsetWidth
      img.classList.add("animate-avatar")
    }
  }

  // ⭐ 2️⃣ Change avatar and save seed
  const regenerateAvatar = async () => {
    const newSeed = String(Math.random())

    // Save to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      { avatarSeed: newSeed },
      { merge: true }
    )

    setAvatarSeed(newSeed)
    generateAvatar(newSeed)
  }

  // ⭐ 3️⃣ Delete ALL expenses
  const deleteAllExpenses = async () => {
    setLoading(true)
    setError("")
    try {
      const expensesRef = collection(db, `users/${user.uid}/expenses`)
      const snapshot = await getDocs(expensesRef)

      const deletions = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletions)

      setDeleteExpensesOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to delete expenses.")
    } finally {
      setLoading(false)
    }
  }

  // ⭐ 4️⃣ Delete user account
  const deleteAccount = async () => {
    setLoading(true)
    setError("")
    try {
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(user, credential)
      await deleteUser(user)
      navigate("/")
    } catch (err) {
      console.error(err)
      setError("Incorrect password or failed to delete account.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div
          id="avatar-img"
          className="w-28 h-28 rounded-full border shadow overflow-hidden animate-avatar"
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
        />

        <button
          onClick={regenerateAvatar}
          className="mt-3 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
        >
          Change Avatar
        </button>

        <h2 className="mt-4 text-sm font-semibold text-slate-700">
          {user.email}
        </h2>
      </div>

      {/* Delete all expenses */}
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800">Manage Data</h3>
        <button
          onClick={() => setDeleteExpensesOpen(true)}
          className="mt-3 w-full rounded-xl bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Delete All Expenses
        </button>
      </div>

      {/* Delete Account */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-red-600">Delete Account</h3>
        <p className="mt-1 text-xs text-slate-500">
          This action is permanent and cannot be undone.
        </p>

        <button
          onClick={() => setDeleteAccountOpen(true)}
          className="mt-4 w-full rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>

      {/* ---- Modal: Delete All Expenses ---- */}
      <Dialog
        open={deleteExpensesOpen}
        onClose={() => setDeleteExpensesOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-slate-800">
              Delete All Expenses
            </Dialog.Title>

            <p className="mt-2 text-sm text-slate-600">
              Are you sure? This will remove all your expense records permanently.
            </p>

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteExpensesOpen(false)}
                className="flex-1 rounded-xl bg-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={deleteAllExpenses}
                className="flex-1 rounded-xl bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* ---- Modal: Delete Account ---- */}
      <Dialog
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-slate-800">
              Confirm Account Deletion
            </Dialog.Title>

            <p className="mt-2 text-sm text-slate-600">
              Enter your password to delete your account.
            </p>

            <input
              type="password"
              placeholder="Password"
              className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteAccountOpen(false)}
                className="flex-1 rounded-xl bg-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={deleteAccount}
                className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
