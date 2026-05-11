const API_URL = import.meta.env.VITE_API_URL

export async function register(username, email, fullname, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, fullname, password })
  })
  if (!res.ok) throw new Error('Error al registrar')
  return res.json()
}


