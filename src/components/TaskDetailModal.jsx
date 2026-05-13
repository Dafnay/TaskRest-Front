import { STATUS_LABELS, STATUS_BADGE, PRIORITY_LABELS, PRIORITY_BADGE } from '../constants/task'

export default function TaskDetailModal({ show, onClose, task }) {
  if (!show || !task) return null
  const deadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString('es-ES')
    : '—'

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{task.title}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <dl className="row mb-0">
                <dt className="col-4">Descripción</dt>
                <dd className="col-8">{task.description || '—'}</dd>
                <dt className="col-4">Categoría</dt>
                <dd className="col-8">{task.category?.title || '—'}</dd>
                <dt className="col-4">Tags</dt>
                <dd className="col-8">
                  {task.tags?.length
                    ? task.tags.map(t => (
                        <span key={t.id} className="badge bg-secondary me-1">{t.name}</span>
                      ))
                    : '—'}
                </dd>
                <dt className="col-4">Fecha límite</dt>
                <dd className="col-8">{deadline}</dd>
                <dt className="col-4">Estado</dt>
                <dd className="col-8">
                  <span className={`badge ${STATUS_BADGE[task.status] ?? 'bg-secondary'}`}>
                    {STATUS_LABELS[task.status] ?? task.status}
                  </span>
                </dd>
                <dt className="col-4">Prioridad</dt>
                <dd className="col-8">
                  {task.priority
                    ? <span className={`badge ${PRIORITY_BADGE[task.priority] ?? 'bg-secondary'}`}>{PRIORITY_LABELS[task.priority] ?? task.priority}</span>
                    : '—'}
                </dd>
                <dt className="col-4">Notas</dt>
                <dd className="col-8">{task.notes || '—'}</dd>
              </dl>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  )
}
