export const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, authHeader, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

export async function register(username, email, fullname, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, fullname, password })
  })
  if (!res.ok) throw new Error('Error al registrar')
  return res.json()
}


