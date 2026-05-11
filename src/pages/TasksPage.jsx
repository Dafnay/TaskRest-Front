import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskService'
import TaskFormModal from '../components/TaskFormModal'
import { useConfirm } from '../hooks/useConfirm'

function TaskRow({ task, onEdit, onDelete, onToggleComplete }) {
  const deadline = task.deadline ? new Date(task.deadline) : null
  const isOverdue = deadline && !task.completed && deadline < new Date()

  return (
    <tr className={task.completed ? 'table-success' : isOverdue ? 'table-danger' : ''}>
      <td className={task.completed ? 'text-decoration-line-through text-muted' : ''}>
        {task.title}
      </td>
      <td className="d-none d-md-table-cell">
        {task.category && (
          <span className="badge bg-primary">{task.category.title}</span>
        )}
      </td>
      <td className="d-none d-md-table-cell">
        <div className="d-flex flex-wrap gap-1">
          {task.tags?.map(tag => (
            <span key={tag.id} className="badge bg-secondary">{tag.name}</span>
          ))}
        </div>
      </td>
      <td className={isOverdue ? 'text-danger fw-semibold' : ''}>
        {deadline ? deadline.toLocaleDateString('es-ES') : '—'}
      </td>
      <td>
        <div className="d-flex gap-1">
          <button
            className={`btn btn-sm ${task.completed ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => onToggleComplete(task)}
            title={task.completed ? 'Desmarcar' : 'Completar'}
          >
            <i className={`bi ${task.completed ? 'bi-check-circle-fill' : 'bi-check-circle'}`} />
            <span className="d-none d-md-inline ms-1">
              {task.completed ? 'Completada' : 'Completar'}
            </span>
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(task)}
            title="Editar"
          >
            <i className="bi bi-pencil" />
            <span className="d-none d-md-inline ms-1">Editar</span>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(task.id)}
            title="Eliminar"
          >
            <i className="bi bi-trash" />
            <span className="d-none d-md-inline ms-1">Eliminar</span>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function TasksPage() {
  const { getAuthHeader } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const { confirm, modal: confirmModal } = useConfirm()

  useEffect(() => {
    getTasks(getAuthHeader())
      .then(setTasks)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditingTask(null)
    setShowModal(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const handleToggleComplete = async (task) => {
    try {
      const updated = await updateTask(getAuthHeader(), task.id, {
        title: task.title,
        description: task.description ?? null,
        deadline: task.deadline ?? null,
        categoryId: task.category?.id ?? null,
        tagIds: task.tags?.map(t => t.id) ?? [],
        completed: !task.completed,
      })
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    } catch (e) {
      alert(e.message)
    }
  }

  const handleSave = async (data) => {
    const auth = getAuthHeader()
    if (editingTask) {
      const updated = await updateTask(auth, editingTask.id, data)
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    } else {
      const created = await createTask(auth, data)
      setTasks(prev => [...prev, created])
    }
  }

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Eliminar tarea',
      message: '¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
    })
    if (!ok) return
    try {
      await deleteTask(getAuthHeader(), id)
      setTasks(prev => prev.filter(t => t.id !== id))
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

  if (error) return (
    <div className="alert alert-danger">{error}</div>
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fs-4">Mis Tareas</h2>
        <button className="btn btn-primary" onClick={openCreate}>Nueva tarea</button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No tienes tareas todavía.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Título</th>
                <th className="d-none d-md-table-cell">Categoría</th>
                <th className="d-none d-md-table-cell">Tags</th>
                <th>Fecha límite</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TaskFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        task={editingTask}
      />
      {confirmModal}
    </div>
  )
}
