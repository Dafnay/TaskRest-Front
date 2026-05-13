import { apiFetch } from './client'

export const getDashboard = (auth) => apiFetch('/dashboard', auth)
