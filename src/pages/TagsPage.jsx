import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTags, createTag, updateTag, deleteTag } from '../api/tagService'
import { useConfirm } from '../hooks/useConfirm'

function TagFormModal({ show, onClose, onSave, tag = null }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!show) return
    setName(tag?.name ?? '')
    setError(null)
  }, [tag, show])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(name)
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
              <h5 className="modal-title">{tag ? 'Editar tag' : 'Nuevo tag'}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : tag ? 'Guardar cambios' : 'Crear'}
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

export default function TagsPage() {
  const { getAuthHeader } = useAuth()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const { confirm, modal: confirmModal } = useConfirm()

  useEffect(() => {
    getTags(getAuthHeader())
      .then(setTags)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditingTag(null)
    setShowModal(true)
  }

  const openEdit = (tag) => {
    setEditingTag(tag)
    setShowModal(true)
  }

  const handleSave = async (name) => {
    const auth = getAuthHeader()
    if (editingTag) {
      const updated = await updateTag(auth, editingTag.id, name)
      setTags(prev => prev.map(t => t.id === updated.id ? updated : t))
    } else {
      const created = await createTag(auth, name)
      setTags(prev => [...prev, created])
    }
  }

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Eliminar tag',
      message: '¿Estás seguro? Se eliminará de todas las tareas que lo tengan asignado.',
      confirmLabel: 'Eliminar',
    })
    if (!ok) return
    try {
      await deleteTag(getAuthHeader(), id)
      setTags(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      alert(e.message)
    }
  }

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  )

  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fs-4">Tags</h2>
        <button className="btn btn-primary" onClick={openCreate}>Nuevo tag</button>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No hay tags todavía.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tags.map(tag => (
                <tr key={tag.id}>
                  <td><span className="badge bg-secondary fs-6">{tag.name}</span></td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEdit(tag)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil" />
                        <span className="d-none d-md-inline ms-1">Editar</span>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(tag.id)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash" />
                        <span className="d-none d-md-inline ms-1">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TagFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        tag={editingTag}
      />
      {confirmModal}
    </div>
  )
}
