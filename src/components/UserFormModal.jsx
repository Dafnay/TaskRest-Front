import { useState, useEffect } from 'react'

export default function UserFormModal({ show, onClose, onSave, user }) {
  const [form, setForm] = useState({ username: '', email: '', fullname: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!show) return
    setForm({ username: user?.username ?? '', email: user?.email ?? '', fullname: user?.fullname ?? '', password: '' })
    setError(null)
  }, [user, show])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar usuario</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {[
                  { key: 'fullname', label: 'Nombre completo', type: 'text' },
                  { key: 'username', label: 'Usuario', type: 'text' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'password', label: 'Nueva contraseña (opcional)', type: 'password' },
                ].map(({ key, label, type }) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      className="form-control"
                      value={form[key]}
                      onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                      required={key !== 'password'}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  )
}
