import { Button, Card } from '../components/ui'
import { useAuthStore } from '../stores/auth'

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const loading = useAuthStore((s) => s.loading)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">Panel</div>
          <Button variant="ghost" onClick={() => logout()} disabled={loading}>
            {loading ? 'Saliendo…' : 'Cerrar sesión'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400">Sesión activa con Sanctum (cookies).</p>
        </div>

        <Card className="space-y-2">
          <div className="text-sm text-slate-400">Usuario actual</div>
          <div className="text-lg font-semibold">{user?.name ?? '—'}</div>
          <div className="text-sm text-slate-300">{user?.email ?? '—'}</div>
        </Card>
      </main>
    </div>
  )
}

