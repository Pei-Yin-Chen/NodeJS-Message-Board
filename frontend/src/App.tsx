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
import PageBackground from './components/PageBackground'
import { useAuthStore } from './store/useAuthStore'
import { useMessageStore } from './store/useMessageStore'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    background: {
      default: '#eef2ff',
      paper: 'transparent',
    },
  },
})

function App() {
  const { checkAuth, isInitialized } = useAuthStore()
  const fetchMessages = useMessageStore((state) => state.fetchMessages)

  useEffect(() => {
    void Promise.all([checkAuth(), fetchMessages()])
  }, [checkAuth, fetchMessages])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isInitialized ? (
        <PageBackground>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        </PageBackground>
      ) : (
        <RouterProvider router={router} />
      )}
    </ThemeProvider>
  )
}

export default App
