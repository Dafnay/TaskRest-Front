import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCategories } from '../api/categoryService'
import { getTags } from '../api/tagService'
import { STATUS_LABELS, PRIORITY_LABELS } from '../constants/task'

const emptyForm = {
  title: '',
  description: '',
  deadline: '',
  status: 'PENDING',
  priority: '',
  notes: '',
  categoryId: '',
  tagIds: [],
}

export default function TaskFormModal({ show, onClose, onSave, task = null }) {
  const { getAuthHeader } = useAuth()
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!show) return
    const auth = getAuthHeader()
    getCategories(auth).then(setCategories).catch(() => {})
    getTags(auth).then(setTags).catch(() => {})
  }, [show])

  useEffect(() => {
    if (!show) return
    if (task) {
      setForm({
        title: task.title ?? '',
        description: task.description ?? '',
        deadline: task.deadline ? task.deadline.slice(0, 16) : '',
        status: task.status ?? 'PENDING',
        priority: task.priority ?? '',
        notes: task.notes ?? '',
        categoryId: task.category?.id ?? '',
        tagIds: task.tags?.map(t => t.id) ?? [],
      })
    } else {
      setForm(emptyForm)
    }
    setError(null)
  }, [task, show])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleTagToggle = (id) => {
    setForm(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(id)
        ? prev.tagIds.filter(t => t !== id)
        : [...prev.tagIds, id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave({
        title: form.title,
        description: form.description || null,
        deadline: form.deadline ? `${form.deadline}:00` : null,
        status: form.status,
        priority: form.priority || null,
        notes: form.notes || null,
        categoryId: form.categoryId || null,
        tagIds: form.tagIds,
      })
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
        <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{task ? 'Editar tarea' : 'Nueva tarea'}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label className="form-label">Título *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={form.title}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Fecha límite</label>
                    <input
                      type="datetime-local"
                      name="deadline"
                      className="form-control"
                      value={form.deadline}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Categoría</label>
                    <select
                      name="categoryId"
                      className="form-select"
                      value={form.categoryId}
                      onChange={handleChange}
                    >
                      <option value="">Sin categoría</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Estado</label>
                    <select
                      name="status"
                      className="form-select"
                      value={form.status}
                      onChange={handleChange}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Prioridad</label>
                    <select
                      name="priority"
                      className="form-select"
                      value={form.priority}
                      onChange={handleChange}
                    >
                      <option value="">Sin prioridad</option>
                      {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Notas</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows={2}
                    value={form.notes}
                    onChange={handleChange}
                  />
                </div>

                {tags.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Tags</label>
                    <div className="d-flex flex-wrap gap-3">
                      {tags.map(tag => (
                        <div key={tag.id} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`tag-${tag.id}`}
                            checked={form.tagIds.includes(tag.id)}
                            onChange={() => handleTagToggle(tag.id)}
                          />
                          <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                            {tag.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : task ? 'Guardar cambios' : 'Crear tarea'}
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
