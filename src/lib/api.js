import axios from 'axios'

export const API_BASE_URL =
  import.meta.env?.VITE_API_URL?.toString?.() || 'http://localhost:8001'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  // Importante: en axios, el XSRF header puede NO enviarse en requests cross-origin
  // (ej. http://localhost:5173 -> http://localhost:8001). Esto fuerza a enviarlo.
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

export async function csrf() {
  await api.get('/sanctum/csrf-cookie')
}

// Fallback extra (por si el navegador/axios no inyecta el header):
// lee el cookie XSRF-TOKEN y lo coloca en X-XSRF-TOKEN manualmente.
function readCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length < 2) return null
  return parts.pop().split(';').shift() || null
}

api.interceptors.request.use((config) => {
  const token = readCookie('XSRF-TOKEN')
  if (token) {
    config.headers = config.headers || {}
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
  }
  return config
})