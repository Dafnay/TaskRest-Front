import { apiFetch } from './client'

export const getTasks = async (auth) => {
  try {
    return await apiFetch('/task/', auth)
  } catch (e) {
    if (e.message === 'Error 404') return []
    throw e
  }
}
export const getTask = (auth, id) => apiFetch(`/task/${id}`, auth)
export const createTask = (auth, data) => apiFetch('/task/', auth, { method: 'POST', body: JSON.stringify(data) })
export const updateTask = (auth, id, data) => apiFetch(`/task/${id}`, auth, { method: 'PUT', body: JSON.stringify(data) })
export const deleteTask = (auth, id) => apiFetch(`/task/${id}`, auth, { method: 'DELETE' })
export const searchTasks = (auth, title) => apiFetch(`/task/search?title=${encodeURIComponent(title)}`, auth)
export const searchByStatus = (auth, status) => apiFetch(`/task/search?status=${status}`, auth)
