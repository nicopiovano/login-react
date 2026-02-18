import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { useAuthStore } from './stores/auth'

function GuestOnly({ children }) {
  const user = useAuthStore((s) => s.user)
  const bootstrapping = useAuthStore((s) => s.bootstrapping)

  if (bootstrapping) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function SignatureFooter() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-4">
      <div className="pointer-events-auto max-w-xl rounded-2xl border border-black/10 bg-white/75 px-3 py-2 text-xs text-zinc-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100">
        <span className="font-medium">Desarrollado con</span>
        <span className="mx-2 text-zinc-600 dark:text-zinc-300">
          React · Tailwind · Laravel · AI
        </span>
        <a
          href="https://nico-piovano-porfolio.vercel.app/es"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          <span className="font-medium">by Nico Piovano</span>
        </a>
      </div>
    </div>
  )
}

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnly>
              <Register />
            </GuestOnly>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <SignatureFooter />
    </>
  )
}

