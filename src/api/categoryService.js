import { apiFetch } from './client'

const basePath = (role) => {
  if (role === 'ADMIN') return '/admin/categories'
  if (role === 'GESTOR') return '/manager/categories'
  return '/categories'
}

export const getCategories = (auth, role) => apiFetch(basePath(role), auth)
export const createCategory = (auth, title, role) => apiFetch(basePath(role), auth, { method: 'POST', body: title, headers: { 'Content-Type': 'text/plain' } })
export const updateCategory = (auth, id, title, role) => apiFetch(`${basePath(role)}/${id}`, auth, { method: 'PUT', body: title, headers: { 'Content-Type': 'text/plain' } })
export const deleteCategory = (auth, id, role) => apiFetch(`${basePath(role)}/${id}`, auth, { method: 'DELETE' })
