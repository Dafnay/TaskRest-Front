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
                  <span className={`badge ${task.completed ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {task.completed ? 'Completada' : 'Pendiente'}
                  </span>
                </dd>
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
