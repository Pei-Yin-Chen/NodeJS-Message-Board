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
  const { checkAuth, isInitialized } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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
