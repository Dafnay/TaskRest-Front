import { apiFetch } from './client'

export const getTags = async (auth) => {
  try {
    return await apiFetch('/tag/', auth)
  } catch (e) {
    if (e.message === 'Error 404') return []
    throw e
  }
}
export const getTag = (auth, id) => apiFetch(`/tag/${id}`, auth)
export const createTag = (auth, name) => apiFetch('/tag/', auth, { method: 'POST', body: name, headers: { 'Content-Type': 'text/plain' } })
export const updateTag = (auth, id, name) => apiFetch(`/tag/${id}`, auth, { method: 'PUT', body: name, headers: { 'Content-Type': 'text/plain' } })
export const deleteTag = (auth, id) => apiFetch(`/tag/${id}`, auth, { method: 'DELETE' })
