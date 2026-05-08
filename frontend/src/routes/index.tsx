import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import MainLayout from '../components/MainLayout'
import MessageBoard from '../pages/MessageBoard'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MessageBoard />,
      },
    ],
  },
  {
    // 萬用路徑：找不到頁面時回到首頁或登入頁
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
