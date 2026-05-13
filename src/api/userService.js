import { apiFetch } from './client'

export const getUsers = (auth) => apiFetch('/admin/users', auth)
export const getUserById = (auth, id) => apiFetch(`/admin/users/${id}`, auth)
export const editUser = (auth, id, data) => apiFetch(`/admin/users/${id}`, auth, { method: 'PUT', body: JSON.stringify(data) })
export const deleteUser = (auth, id) => apiFetch(`/admin/users/${id}`, auth, { method: 'DELETE' })
export const promoteUser = (auth, id) => apiFetch(`/admin/users/${id}/promote`, auth, { method: 'POST' })
export const demoteUser = (auth, id) => apiFetch(`/admin/users/${id}/demote`, auth, { method: 'POST' })
export const updateProfile = (auth, data) => apiFetch('/user/profile', auth, { method: 'PUT', body: JSON.stringify(data) })
