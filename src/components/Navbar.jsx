import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const navItems = [
  { name: 'Dashboard', to: '/' },
  { name: 'Expenses', to: '/expenses' },
  { name: 'Filters', to: '/filters' },
]

export default function Navbar({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut(auth)
  }

  const linkBase =
    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors'
  const activeClasses = 'bg-slate-900 text-white'
  const inactiveClasses = 'text-slate-600 hover:bg-slate-100'

  return (
    <>
      {/* Top bar */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Left: logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">
              ET
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-semibold text-slate-900">
                Expense Tracker
              </span>
              <span className="text-xs text-slate-500">
                Personal finance dashboard
              </span>
            </div>
          </div>

          {/* Center: nav (desktop) */}
          <nav className="hidden items-center gap-2 sm:flex">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClasses : inactiveClasses}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right: user + sign out (desktop) */}
          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-xs text-slate-500">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              Sign out
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            className="inline-flex items-center justify-center rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 sm:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            {/* Simple icon */}
            <div className="space-y-0.5">
              <span className="block h-0.5 w-4 bg-slate-700" />
              <span className="block h-0.5 w-4 bg-slate-700" />
              <span className="block h-0.5 w-4 bg-slate-700" />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile sidebar using Headless UI */}
      <Transition show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 sm:hidden" onClose={setMobileOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transition-transform duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition-transform duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="flex w-64 flex-col bg-white p-4 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <Link
                    to="/"
                    className="flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">
                      ET
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      Expense Tracker
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `rounded-xl px-3 py-2 text-sm ${
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-auto pt-4">
                  <p className="mb-2 text-xs text-slate-500">{user?.email}</p>
                  <button
                    onClick={async () => {
                      await handleSignOut()
                      setMobileOpen(false)
                    }}
                    className="w-full rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  >
                    Sign out
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
