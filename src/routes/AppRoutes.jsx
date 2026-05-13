import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register'
import TaskLayout from '../layout/TaskLayout'
import TasksPage from '../pages/TasksPage'
import CategoriesPage from '../pages/CategoriesPage'
import TagsPage from '../pages/TagsPage'
import UsersPage from '../pages/UsersPage'
import ProfilePage from '../pages/ProfilePage'
import DashboardPage from '../pages/DashboardPage'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function UserOnlyRoute({ children }) {
  const { isAuthenticated, currentUser } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (currentUser?.role === 'ADMIN') return <Navigate to="/users" replace />
  return children
}

function AdminOnlyRoute({ children }) {
  const { isAuthenticated, currentUser } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (currentUser?.role !== 'ADMIN') return <Navigate to="/tasks" replace />
  return children
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={
            <UserOnlyRoute>
              <TaskLayout><TasksPage /></TaskLayout>
            </UserOnlyRoute>
          } />
          <Route path="/categories" element={
            <PrivateRoute>
              <TaskLayout><CategoriesPage /></TaskLayout>
            </PrivateRoute>
          } />
          <Route path="/tags" element={
            <UserOnlyRoute>
              <TaskLayout><TagsPage /></TaskLayout>
            </UserOnlyRoute>
          } />
          <Route path="/users" element={
            <AdminOnlyRoute>
              <TaskLayout><UsersPage /></TaskLayout>
            </AdminOnlyRoute>
          } />
          <Route path="/dashboard" element={
            <UserOnlyRoute>
              <TaskLayout><DashboardPage /></TaskLayout>
            </UserOnlyRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <TaskLayout><ProfilePage /></TaskLayout>
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
