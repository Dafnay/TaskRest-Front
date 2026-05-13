import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { NavLink, useNavigate } from 'react-router-dom'


const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

function SidebarContent({ currentUser, onLinkClick }) {
  return (
    <div className="nav flex-column nav-pills" onClick={onLinkClick}>
      {currentUser?.role !== 'ADMIN' && (
        <>
          <NavLink to="/tasks" className={navLinkClass}>Mis Tareas</NavLink>
          <NavLink to="/tags" className={navLinkClass}>Tags</NavLink>
        </>
      )}
      {currentUser?.role === 'ADMIN' && (
        <NavLink to="/users" className={navLinkClass}>Usuarios</NavLink>
      )}
      <NavLink to="/categories" className={navLinkClass}>Categorías</NavLink>
      
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
              <div className="d-flex align-items-center justify-content-between mb-1">
                <strong className="text-truncate me-2">{currentUser.username}</strong>
                <span className="badge bg-secondary flex-shrink-0">{currentUser.role}</span>
              </div>
              <NavLink to="/profile" className={navLinkClass} onClick={closeSidebar}>
                Perfil
              </NavLink>
              <button className="btn btn-sm btn-outline-danger w-100 mt-2" onClick={handleLogout}>
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
