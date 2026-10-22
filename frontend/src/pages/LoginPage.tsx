import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Alert,
  Container,
  Box,
  Divider,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GoogleIcon from '@mui/icons-material/Google'
import { glassCard, glassInput, glassAuthPrimary, glassAuthOutlined, glassSectionTitle } from '../styles/glass'
import PageBackground from '../components/PageBackground'
import { useAuthStore } from '../store/useAuthStore'
import { getCurrentBaseURL } from '../api/axiosInstance'

const ERROR_MESSAGES = {
  access_denied: '您已取消 Google 授權。',
  oauth_failed: '登入過程發生錯誤，請檢查網路連線。',
  default: '登入失敗，請稍後再試。',
}

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { user, isInitialized, loginAction } = useAuthStore()
  const [searchParams] = useSearchParams()
  const errorCode = searchParams.get('error')
  const location = useLocation()
  const navigate = useNavigate()

  const registerSuccessMessage =
    (location.state as { message?: string } | null)?.message ?? ''

  const urlErrorMessage = errorCode
    ? ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] ||
      ERROR_MESSAGES.default
    : ''

  const displayError = error || urlErrorMessage

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // 當使用者開始輸入時，清空錯誤訊息
    if (error) setError('')
  }

  useEffect(() => {
    if (isInitialized && user) {
      navigate('/')
    }
  }, [user, isInitialized, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await loginAction({
      ...formData,
      email: formData.email.toLowerCase().trim(),
    })
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error?.message || '登入失敗，請檢查您的帳號密碼')
    }
  }

  const handleGoogleLogin = () => {
    const apiBaseURL = getCurrentBaseURL();
    window.location.href = `${apiBaseURL}/auth/google`
  }

  return (
    <PageBackground>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="xs">
        <Paper
          sx={{
            ...glassCard,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={glassSectionTitle}>
            登入會員
          </Typography>

          {registerSuccessMessage && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              {registerSuccessMessage}
            </Alert>
          )}

          {displayError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              {displayError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                電子郵件
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                size="small"
                required
                sx={glassInput}
              />
            </Box>

            <Box sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                輸入密碼
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="請輸入密碼"
                value={formData.password}
                onChange={handleChange}
                size="small"
                required
                sx={glassInput}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{ ...glassAuthPrimary, mb: 1.5 }}
            >
              登入系統
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              sx={{ ...glassAuthOutlined, mb: 1.5 }}
            >
              返回上一頁
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/register')}
              startIcon={<PersonAddIcon />}
              sx={glassAuthOutlined}
            >
              註冊新帳號
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                或使用以下方式
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{ ...glassAuthOutlined, py: 1 }}
            >
              使用 Google 帳號登入
            </Button>
          </form>
        </Paper>
        </Container>
      </Box>
    </PageBackground>
  )
}

export default LoginPage
