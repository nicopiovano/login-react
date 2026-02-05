import { create } from 'zustand'
import { api, csrf } from '../lib/api'

function errorMessage(err) {
  const status = err?.response?.status
  const data = err?.response?.data

  if (status === 422 && data?.errors) {
    const firstKey = Object.keys(data.errors)[0]
    const firstMsg = data.errors?.[firstKey]?.[0]
    if (firstMsg) return String(firstMsg)
  }

  if (data?.message) return String(data.message)
  if (err?.message) return String(err.message)
  return 'Ocurrió un error.'
}

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  bootstrapping: true,
  error: null,

  clearError: () => set({ error: null }),
  setError: (message) => set({ error: message }),

  emailExists: async (email) => {
    const normalized = String(email || '').trim().toLowerCase()
    const res = await api.get('/api/email-exists', { params: { email: normalized } })
    // Chequeo estricto: evita falsos positivos si "exists" viniera como string ("false"/"0")
    return res?.data?.exists === true
  },

  me: async () => {
    const res = await api.get('/api/user')
    return res.data
  },

  bootstrap: async () => {
    set({ bootstrapping: true })
    try {
      const user = await api.get('/api/user').then((r) => r.data)
      set({ user, error: null })
    } catch {
      set({ user: null })
    } finally {
      set({ bootstrapping: false })
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null })
    try {
      await csrf()
      await api.post('/api/login', { email, password })
      const user = await api.get('/api/user').then((r) => r.data)
      set({ user })
      return user
    } catch (err) {
      set({ error: errorMessage(err) })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  register: async ({ name, email, password, password_confirmation }) => {
    set({ loading: true, error: null })
    try {
      await csrf()
      await api.post('/api/register', {
        name,
        email,
        password,
        password_confirmation,
      })
      const user = await api.get('/api/user').then((r) => r.data)
      set({ user })
      return user
    } catch (err) {
      set({ error: errorMessage(err) })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    try {
      await csrf()
      await api.post('/api/logout')
    } finally {
      set({ user: null, loading: false })
    }
  },
}))

