import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryService'
import { useConfirm } from '../hooks/useConfirm'

const canManage = (role) => role?.includes('ADMIN') || role?.includes('GESTOR')

function CategoryFormModal({ show, onClose, onSave, category = null }) {
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!show) return
    setTitle(category?.title ?? '')
    setError(null)
  }, [category, show])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(title)
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
              <h5 className="modal-title">{category ? 'Editar categoría' : 'Nueva categoría'}</h5>
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
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : category ? 'Guardar cambios' : 'Crear'}
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

export default function CategoriesPage() {
  const { getAuthHeader, currentUser } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const { confirm, modal: confirmModal } = useConfirm()

  const manage = canManage(currentUser?.role)

  useEffect(() => {
    getCategories(getAuthHeader(), currentUser?.role)
      .then(setCategories)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const openEdit = (category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleSave = async (title) => {
    const auth = getAuthHeader()
    const role = currentUser?.role
    if (editingCategory) {
      const updated = await updateCategory(auth, editingCategory.id, title, role)
      setCategories(prev => prev.map(c => c.id === updated.id ? updated : c))
    } else {
      const created = await createCategory(auth, title, role)
      setCategories(prev => [...prev, created])
    }
  }

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Eliminar categoría',
      message: '¿Estás seguro? Las tareas asociadas perderán esta categoría.',
      confirmLabel: 'Eliminar',
    })
    if (!ok) return
    try {
      await deleteCategory(getAuthHeader(), id, currentUser?.role)
      setCategories(prev => prev.filter(c => c.id !== id))
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
        <h2 className="mb-0 fs-4">Categorías</h2>
        {manage && (
          <button className="btn btn-primary" onClick={openCreate}>Nueva categoría</button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No hay categorías todavía.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                {manage && <th></th>}
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.title}</td>
                  {manage && (
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(category)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil" />
                          <span className="d-none d-md-inline ms-1">Editar</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(category.id)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash" />
                          <span className="d-none d-md-inline ms-1">Eliminar</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CategoryFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        category={editingCategory}
      />
      {confirmModal}
    </div>
  )
}
