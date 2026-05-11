import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { NavLink, useNavigate } from 'react-router-dom'

const isGestor = (role) => role === 'GESTOR' || role === 'ADMIN'
const isAdmin = (role) => role === 'ADMIN'

function SidebarContent({ currentUser, onLinkClick }) {
  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

  return (
    <div className="nav flex-column nav-pills" onClick={onLinkClick}>
      <NavLink to="/tasks" className={navLinkClass}>Mis Tareas</NavLink>
      <NavLink to="/tags" className={navLinkClass}>Tags</NavLink>
      <NavLink to="/categories" className={navLinkClass}>Categorías</NavLink>

      {currentUser && isGestor(currentUser.role) && (
        <>
          <div className="px-3 pt-3 pb-1 text-uppercase text-muted small fw-semibold">
            Gestión
          </div>
          <NavLink to="/manage/categories" className={navLinkClass}>
            Gestión de Categorías
          </NavLink>
        </>
      )}

      {currentUser && isAdmin(currentUser.role) && (
        <>
          <div className="px-3 pt-3 pb-1 text-uppercase text-muted small fw-semibold">
            Admin
          </div>
          <NavLink to="/admin" className={navLinkClass}>Administración</NavLink>
        </>
      )}
    </div>
  )
}

export default function TaskLayout({ children }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <>
      {/* Top bar — solo en móvil */}
      <div className="d-flex d-lg-none align-items-center justify-content-between px-3 py-2 border-bottom bg-white position-sticky top-0" style={{ zIndex: 1046 }}>
        <span className="fw-bold">TaskRest</span>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <span>&#9776;</span>
        </button>
      </div>

      <div className="d-flex flex-grow-1">
        {/* Backdrop móvil */}
        {sidebarOpen && (
          <div className="sidebar-backdrop d-lg-none" onClick={closeSidebar} />
        )}

        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
          <div className="sidebar-brand d-none d-lg-block">TaskRest</div>

          {/* Cabecera del sidebar en móvil */}
          <div className="d-flex d-lg-none align-items-center justify-content-between px-3 py-3">
            <span className="fw-bold">TaskRest</span>
            <button className="btn-close" onClick={closeSidebar} aria-label="Cerrar menú" />
          </div>

          <nav className="sidebar-nav">
            <SidebarContent currentUser={currentUser} onLinkClick={closeSidebar} />
          </nav>

          {currentUser && (
            <div className="sidebar-footer">
              <div className="mb-2">
                <strong className="d-block">{currentUser.username}</strong>
                <span className="badge bg-secondary">{currentUser.role}</span>
              </div>
              <button className="btn btn-sm btn-outline-danger w-100" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </aside>

        <main className="sidebar-main p-4">
          {children}
        </main>
      </div>
    </>
  )
}
