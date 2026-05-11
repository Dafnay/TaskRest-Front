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
export const createTag = (auth, data) => apiFetch('/tag/', auth, { method: 'POST', body: JSON.stringify(data) })
export const updateTag = (auth, id, data) => apiFetch(`/tag/${id}`, auth, { method: 'PUT', body: JSON.stringify(data) })
export const deleteTag = (auth, id) => apiFetch(`/tag/${id}`, auth, { method: 'DELETE' })
