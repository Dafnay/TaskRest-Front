import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function TaskLayout({ children }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
        <h1 className="mb-0 fs-4 fw-bold">TaskRest</h1>
        {currentUser && (
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">
              <strong>{currentUser.username}</strong>
              <span className="badge bg-secondary ms-2">{currentUser.role}</span>
            </span>
            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </header>
      <main className="p-4">
        {children}
      </main>
    </>
  )
}
