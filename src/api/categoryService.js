import { apiFetch } from './client'

export const getCategories = (auth) => apiFetch('/categories', auth)
