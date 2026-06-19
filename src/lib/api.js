// Central API client for the TenantTrails backend.
// Base URL comes from Vite env (VITE_API_URL), defaulting to the local server.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TOKEN_KEY = 'tt_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// Core request helper. Adds JSON headers, the Bearer token when present, and
// throws an Error (with the server's message) on non-2xx responses.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  const text = await res.text()
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  return data
}

// Multipart upload helper (does not set Content-Type so the browser adds the
// multipart boundary). Returns { url } from the Cloudinary endpoint.
export async function uploadImage(file) {
  const form = new FormData()
  form.append('image', file)

  const headers = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}/api/uploads`, {
    method: 'POST',
    headers,
    body: form,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }
  if (!res.ok) {
    const message = (data && data.error) || `Upload failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  // Auth
  signup: (payload) => request('/api/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  me: () => request('/api/auth/me', { auth: true }),
  myReviews: () => request('/api/auth/me/reviews', { auth: true }),

  // Apartments
  listApartments: () => request('/api/apartments'),
  getApartment: (id) => request(`/api/apartments/${id}`),

  // Reviews
  addReview: (aptId, payload) =>
    request(`/api/apartments/${aptId}/reviews`, { method: 'POST', body: payload, auth: true }),
  deleteReview: (id) =>
    request(`/api/reviews/${id}`, { method: 'DELETE', auth: true }),

  // Uploads
  uploadImage,
}

export default api
