import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  CircularProgress,
} from '@mui/material'
import router from './routes'
import { useAuthStore } from './store/useAuthStore'
import api from './api/axiosInstance'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
})

function App() {
  const { setUser, isInitialized } = useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get('/auth/me')
        setUser(response.data.user)
      } catch (error) {
        setUser(null)
      }
    }
    initAuth()
  }, [setUser])

  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
