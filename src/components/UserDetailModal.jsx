const roleColor = { ADMIN: 'danger', GESTOR: 'warning', USER: 'secondary' }

export default function UserDetailModal({ show, onClose, user }) {
  if (!show || !user) return null

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detalle de usuario</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <dl className="row mb-0">
                <dt className="col-4">Nombre</dt>
                <dd className="col-8">{user.fullname}</dd>
                <dt className="col-4">Usuario</dt>
                <dd className="col-8">{user.username}</dd>
                <dt className="col-4">Email</dt>
                <dd className="col-8">{user.email}</dd>
                <dt className="col-4">Rol</dt>
                <dd className="col-8">
                  <span className={`badge bg-${roleColor[user.role] ?? 'secondary'}`}>{user.role}</span>
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
