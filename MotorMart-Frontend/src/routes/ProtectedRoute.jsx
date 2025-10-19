import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { useEffect } from 'react'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()
  const toast = useToast()
  const location = useLocation()
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please log in to continue')
    } else if (roles && user && !roles.includes(user.role)) {
      toast.error('You do not have permission to view that page')
    }
  }, [isAuthenticated, user, roles, toast])
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return children
}


