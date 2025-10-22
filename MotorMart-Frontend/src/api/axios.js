import Axios from 'axios'

// Prefer env var if provided, otherwise default to the backend's launch port
const baseURL = import.meta.env?.VITE_API_URL || 'http://localhost:5190'

const api = Axios.create({
  baseURL,
})

api.interceptors.request.use(config => {
  // Don't add token for login/register endpoints
  const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/register')
  
  if (!isAuthEndpoint) {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  response => response,
  error => {
    // If we get a 401 on a protected endpoint, clear the token and redirect to login
    if (error.response?.status === 401 && !error.config.url?.includes('/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

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


