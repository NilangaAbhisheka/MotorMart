import Axios from 'axios'

// Prefer env var if provided, otherwise default to the backend's launch port
const baseURL = import.meta.env?.VITE_API_URL || 'http://localhost:5190'

const api = Axios.create({
  baseURL,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Helper function to get full image URL
export function getImageUrl(path) {
  if (!path) return null
  // If path already starts with http, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // Otherwise prepend the base URL
  return `${baseURL}${path.startsWith('/') ? '' : '/'}${path}`
}

export default api


