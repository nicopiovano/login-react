import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Input, Label } from '../components/ui'
import { useAuthStore } from '../stores/auth'

export default function Register() {
  const navigate = useNavigate()

  const register = useAuthStore((s) => s.register)
  const emailExists = useAuthStore((s) => s.emailExists)
  const loading = useAuthStore((s) => s.loading)
  const clearError = useAuthStore((s) => s.clearError)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [invalid, setInvalid] = useState({
    name: false,
    email: false,
    password: false,
    password_confirmation: false,
  })
  const [help, setHelp] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  async function onSubmit(e) {
    e.preventDefault()
    clearError()
    setInvalid({
      name: false,
      email: false,
      password: false,
      password_confirmation: false,
    })
    setHelp({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    })

    const next = {
      name: !name.trim(),
      email: !email.trim() || !email.includes('@'),
      password: !password.trim() || password.length < 8,
      password_confirmation:
        !passwordConfirmation.trim() ||
        passwordConfirmation.length < 8 ||
        passwordConfirmation !== password,
    }
    if (next.name || next.email || next.password || next.password_confirmation) {
      setInvalid(next)
      setHelp({
        name: next.name ? 'El nombre es obligatorio.' : '',
        email: next.email ? 'Ingresá un email válido.' : '',
        password: next.password ? 'Mínimo 8 caracteres.' : '',
        password_confirmation: next.password_confirmation ? 'Debe coincidir con la contraseña.' : '',
      })
      return
    }

    // UX: chequear si el email ya existe antes de intentar registrar
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const exists = await emailExists(normalizedEmail)
      if (exists) {
        setInvalid((p) => ({ ...p, email: true }))
        setHelp((p) => ({ ...p, email: 'Ese email ya está registrado.' }))
        return
      }
    } catch {
      // Si falla el chequeo, seguimos igual: el backend igual valida unique
    }

    try {
      await register({
        name,
        email: email.trim().toLowerCase(),
        password,
        password_confirmation: passwordConfirmation,
      })

      navigate('/dashboard', { replace: true })
    } catch (err) {
      const errors = err?.response?.data?.errors || {}
      const getFirst = (k) => (Array.isArray(errors[k]) ? errors[k][0] : '')
      setInvalid({
        name: Boolean(errors.name),
        email: Boolean(errors.email),
        password: Boolean(errors.password),
        password_confirmation: Boolean(errors.password_confirmation),
      })
      setHelp({
        name: getFirst('name'),
        email: getFirst('email'),
        password: getFirst('password'),
        password_confirmation: getFirst('password_confirmation'),
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
          <p className="text-sm text-slate-400">
            Registrate y entrá directamente al panel.
          </p>
        </div>

        <Card>
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="space-y-1">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (invalid.name) setInvalid((p) => ({ ...p, name: false }))
                  if (help.name) setHelp((p) => ({ ...p, name: '' }))
                }}
                invalid={invalid.name}
              />
              {help.name ? <p className="text-xs text-red-300">{help.name}</p> : null}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (invalid.email) setInvalid((p) => ({ ...p, email: false }))
                  if (help.email) setHelp((p) => ({ ...p, email: '' }))
                }}
                invalid={invalid.email}
              />
              {help.email ? <p className="text-xs text-red-300">{help.email}</p> : null}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (invalid.password) setInvalid((p) => ({ ...p, password: false }))
                  if (help.password) setHelp((p) => ({ ...p, password: '' }))
                }}
                invalid={invalid.password}
              />
              {help.password ? <p className="text-xs text-red-300">{help.password}</p> : null}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password_confirmation">Confirmación</Label>
              <Input
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value)
                  if (invalid.password_confirmation)
                    setInvalid((p) => ({ ...p, password_confirmation: false }))
                  if (help.password_confirmation)
                    setHelp((p) => ({ ...p, password_confirmation: '' }))
                }}
                invalid={invalid.password_confirmation}
              />
              {help.password_confirmation ? (
                <p className="text-xs text-red-300">{help.password_confirmation}</p>
              ) : null}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creando…' : 'Crear cuenta'}
            </Button>

            <p className="text-sm text-slate-400">
              ¿Ya tenés cuenta?{' '}
              <Link className="text-indigo-400 hover:text-indigo-300" to="/login">
                Iniciá sesión
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}

