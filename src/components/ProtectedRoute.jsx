import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const bootstrapping = useAuthStore((s) => s.bootstrapping)
  const location = useLocation()

  if (bootstrapping) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-100">
        <div className="text-sm text-slate-300">Cargando sesión…</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

