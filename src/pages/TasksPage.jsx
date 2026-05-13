import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask, searchTasks, searchByStatus } from "../api/taskService";
import TaskFormModal from "../components/TaskFormModal";
import { useConfirm } from "../hooks/useConfirm";
import { STATUS_LABELS, STATUS_BADGE, PRIORITY_LABELS, PRIORITY_BADGE } from "../constants/task";

function TaskRow({ task, onEdit, onDelete, onStatusChange }) {
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const isCompleted = task.status === 'COMPLETED';
  const isOverdue = deadline && !isCompleted && deadline < new Date();

  return (
    <tr className={isCompleted ? "table-success" : isOverdue ? "table-danger" : ""}>
      <td className={isCompleted ? "text-decoration-line-through text-muted" : ""}>
        {task.title}
      </td>
      <td className="d-none d-md-table-cell">
        {task.category && (
          <span className="badge bg-primary">{task.category.title}</span>
        )}
      </td>
      <td className="d-none d-md-table-cell">
        <div className="d-flex flex-wrap gap-1">
          {task.tags?.map((tag) => (
            <span key={tag.id} className="badge bg-secondary">{tag.name}</span>
          ))}
        </div>
      </td>
      <td className={isOverdue ? "text-danger fw-semibold" : ""}>
        {deadline ? deadline.toLocaleDateString("es-ES") : "—"}
      </td>
      <td className="d-none d-md-table-cell">
        <select
          className="form-select form-select-sm"
          value={task.status}
          onChange={e => onStatusChange(task, e.target.value)}
        >
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </td>
      <td className="d-none d-md-table-cell">
        {task.priority
          ? <span className={`badge ${PRIORITY_BADGE[task.priority]}`}>{PRIORITY_LABELS[task.priority]}</span>
          : '—'}
      </td>
      <td>
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-outline-warning"
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
  );
}

export default function TasksPage() {
  const { getAuthHeader } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [search, setSearch] = useState('');
  const { confirm, modal: confirmModal } = useConfirm();

  useEffect(() => {
    getTasks(getAuthHeader())
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === '') {
        getTasks(getAuthHeader()).then(setTasks).catch(() => {});
      } else {
        searchTasks(getAuthHeader(), search.trim()).then(setTasks).catch(() => {});
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (filterStatus === '') {
      getTasks(getAuthHeader()).then(setTasks).catch(() => {});
    } else {
      searchByStatus(getAuthHeader(), filterStatus).then(setTasks).catch(() => {});
    }
  }, [filterStatus]);

  const openCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const updated = await updateTask(getAuthHeader(), task.id, {
        title: task.title,
        description: task.description ?? null,
        deadline: task.deadline ?? null,
        status: newStatus,
        priority: task.priority ?? null,
        notes: task.notes ?? null,
        categoryId: task.category?.id ?? null,
        tagIds: task.tags?.map(t => t.id) ?? [],
      });
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSave = async (data) => {
    const auth = getAuthHeader();
    if (editingTask) {
      const updated = await updateTask(auth, editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await createTask(auth, data);
      setTasks((prev) => [...prev, created]);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar tarea",
      message: "¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
    });
    if (!ok) return;
    try {
      await deleteTask(getAuthHeader(), id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = tasks
    .filter(t => !filterPriority || t.priority === filterPriority);

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 fs-4">Mis Tareas</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          Nueva tarea
        </button>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <input
          type="search"
          className="form-control form-control-sm w-auto"
          placeholder="Buscar por título..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-select form-select-sm w-auto"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          className="form-select form-select-sm w-auto"
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>{tasks.length === 0 ? 'No tienes tareas todavía.' : 'No hay tareas con los filtros seleccionados.'}</p>
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
                <th className="d-none d-md-table-cell">Estado</th>
                <th className="d-none d-md-table-cell">Prioridad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
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
  );
}
