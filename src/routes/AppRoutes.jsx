import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register'
import TaskLayout from '../layout/TaskLayout'
import TasksPage from '../pages/TasksPage'
import CategoriesPage from '../pages/CategoriesPage'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={
            <PrivateRoute>
              <TaskLayout><TasksPage /></TaskLayout>
            </PrivateRoute>
          } />
          <Route path="/categories" element={
            <PrivateRoute>
              <TaskLayout><CategoriesPage /></TaskLayout>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
