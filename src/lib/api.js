// Central API client for the TenantTrails backend.
// Base URL comes from Vite env (VITE_API_URL), defaulting to the local server.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Auth now rides on an httpOnly cookie that JavaScript cannot read. Every
// request opts in with credentials: 'include' so the browser attaches it; the
// server's CORS allows credentials for this exact origin. A cross-origin fetch
// leaves cookies out by default, so this flag is required on every call.

// Core request helper. Adds JSON headers, sends the auth cookie, and throws an
// Error (with the server's message) on non-2xx responses.
async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include', // send the httpOnly auth cookie
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

  const res = await fetch(`${BASE_URL}/api/uploads`, {
    method: 'POST',
    credentials: 'include', // send the httpOnly auth cookie
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
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
  myReviews: () => request('/api/auth/me/reviews'),

  // Apartments
  listApartments: () => request('/api/apartments'),
  getApartment: (id) => request(`/api/apartments/${id}`),

  // Reviews
  addReview: (aptId, payload) =>
    request(`/api/apartments/${aptId}/reviews`, { method: 'POST', body: payload }),
  updateReview: (id, payload) =>
    request(`/api/reviews/${id}`, { method: 'PUT', body: payload }),
  deleteReview: (id) =>
    request(`/api/reviews/${id}`, { method: 'DELETE' }),

  // Uploads
  uploadImage,
}

export default api
