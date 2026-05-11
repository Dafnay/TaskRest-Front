import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryService'
import { useConfirm } from '../hooks/useConfirm'
import CategoryFormModal from '../components/CategoryFormModal'

const canManage = (role) => role?.includes('ADMIN') || role?.includes('GESTOR')

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
                {manage && <th>Acciones</th>}
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
                          className="btn btn-sm btn-outline-warning"
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
