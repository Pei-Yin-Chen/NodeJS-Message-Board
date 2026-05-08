import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitialized } = useAuthStore()
  if (!isInitialized) return <div>Loading...</div>
  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default PrivateRoute
