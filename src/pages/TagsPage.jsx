import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTags, createTag, updateTag, deleteTag } from '../api/tagService'
import { useConfirm } from '../hooks/useConfirm'
import TagFormModal from '../components/TagFormModal'

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
        <button className="btn btn-primary" onClick={openCreate}>Añadir tag</button>
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
                <th className="w-100">Nombre</th>
                <th className="w-auto">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tags.map(tag => (
                <tr key={tag.id}>
                  <td><span className="badge bg-secondary fs-6">{tag.name}</span></td>
                  <td className="w-auto text-nowrap">
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-warning"
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
