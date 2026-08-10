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
      main: '#8f7355',
      light: '#a8896a',
      dark: '#6f5840',
    },
    background: {
      default: '#f5f0e9',
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
