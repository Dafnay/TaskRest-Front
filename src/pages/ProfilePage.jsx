import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../api/userService'

export default function ProfilePage() {
  const { currentUser, getAuthHeader, updateCurrentUser } = useAuth()
  const [form, setForm] = useState({
    username: currentUser?.username ?? '',
    email: currentUser?.email ?? '',
    fullname: currentUser?.fullname ?? '',
    password: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const updated = await updateProfile(getAuthHeader(), {
        username: form.username,
        email: form.email,
        fullname: form.fullname,
        password: form.password || null,
      })
      updateCurrentUser(updated, form.password || null)
      setForm(prev => ({ ...prev, password: '' }))
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="fs-4 mb-4">Mi perfil</h2>
      <div className="col-md-6 px-0">

        {success && <div className="alert alert-success">Perfil actualizado correctamente.</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="fullname"
              className="form-control"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Nueva contraseña <span className="text-muted">(dejar vacío para no cambiar)</span></label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
