import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, Input, Label } from '../components/ui'
import { useAuthStore } from '../stores/auth'

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()

    const login = useAuthStore((s) => s.login)
    const loading = useAuthStore((s) => s.loading)
    const clearError = useAuthStore((s) => s.clearError)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [invalid, setInvalid] = useState({ email: false, password: false })
    const [help, setHelp] = useState({ email: '', password: '' })
    const [formHelp, setFormHelp] = useState('')

    const redirectTo = useMemo(() => {
        return location.state?.from?.pathname || '/dashboard'
    }, [location.state])

    async function onSubmit(e) {
        e.preventDefault()
        clearError()
        setInvalid({ email: false, password: false })
        setHelp({ email: '', password: '' })
        setFormHelp('')

        // Validación visual (sin cartel)
        const next = {
            email: !email.trim() || !email.includes('@'),
            password: !password.trim(),
        }
        if (next.email || next.password) {
            setInvalid(next)
            setHelp({
                email: next.email ? 'Ingresá un email válido.' : '',
                password: next.password ? 'La contraseña es obligatoria.' : '',
            })
            return
        }

        try {
            await login({ email, password })
            navigate(redirectTo, { replace: true })
        } catch (err) {
            // Credenciales incorrectas: error general (no de inputs)
            if (err?.response?.status === 401) {
                setFormHelp(err?.response?.data?.message || 'Email o contraseña incorrectos.')
                return
            }

            // Si backend responde 422, marcamos campos que vinieron con error
            const data = err?.response?.data
            const errors = data?.errors || {}
            const emailMsg = Array.isArray(errors.email) ? errors.email[0] : ''
            const passMsg = Array.isArray(errors.password) ? errors.password[0] : ''

            setInvalid({
                email: Boolean(errors.email),
                password: Boolean(errors.password),
            })
            setHelp({
                email: emailMsg || '',
                password: passMsg || '',
            })
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
                    <p className="text-sm text-slate-400">
                        Accedé con tu cuenta para entrar al panel.
                    </p>
                </div>

                <Card>
                    <form className="space-y-4" onSubmit={onSubmit} noValidate>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (invalid.email) setInvalid((prev) => ({ ...prev, email: false }))
                                    if (help.email) setHelp((prev) => ({ ...prev, email: '' }))
                                }}
                                invalid={invalid.email}
                            />
                            {help.email ? (
                                <p className="text-xs text-red-300">{help.email}</p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (invalid.password) setInvalid((prev) => ({ ...prev, password: false }))
                                    if (help.password) setHelp((prev) => ({ ...prev, password: '' }))
                                }}
                                invalid={invalid.password}
                            />
                            {help.password ? (
                                <p className="text-xs text-red-300">{help.password}</p>
                            ) : null}
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Ingresando…' : 'Entrar'}
                        </Button>
                        {formHelp ? (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200 text-center"
                            >
                                {formHelp}
                            </div>
                        ) : null}

                        <p className="text-sm text-slate-400">
                            ¿No tenés cuenta?{' '}
                            <Link
                                className="text-indigo-400 hover:text-indigo-300"
                                to="/register"
                                onClick={() => clearError()}
                            >
                                Registrate
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    )
}

