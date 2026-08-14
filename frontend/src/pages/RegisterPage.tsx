import React, { useState } from 'react'
import {
  Container,
  Box,
  Divider,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GoogleIcon from '@mui/icons-material/Google'
import { glassCard, glassInput, glassAuthPrimary, glassAuthOutlined, glassSectionTitle } from '../styles/glass'
import PageBackground from '../components/PageBackground'
import { useAuthStore } from '../store/useAuthStore'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const { registerAction } = useAuthStore()
  const navigate = useNavigate()

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // 當使用者開始輸入時，清空錯誤訊息
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      return setError('兩次密碼輸入不一致')
    }

    const trimmedUsername = formData.username.trim()

    if (!trimmedUsername) {
      return setError('暱稱不能為空')
    }

    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      return setError('暱稱長度需為 2～20 字')
    }

    const result = await registerAction({
      email: formData.email,
      username: trimmedUsername,
      password: formData.password,
    })

    if (result.success) {
      navigate('/login', {
        state: { message: '註冊成功！請重新登入' },
      })
    } else {
      setError(result.error?.message || '註冊失敗')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <PageBackground>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
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
            註冊帳號
          </Typography>

          {/* 如果有錯誤，顯示提示區塊 */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                暱稱
              </Typography>
              <TextField
                fullWidth
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                size="small"
                required
                sx={glassInput}
                helperText="2～20 字"
              />
            </Box>

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

            <Box sx={{ mb: 2, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                輸入密碼
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="請設定密碼"
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

            <Box sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                確認密碼
              </Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="請再次輸入密碼"
                value={formData.confirmPassword}
                onChange={handleChange}
                size="small"
                required
                sx={glassInput}
                error={
                  formData.confirmPassword !== '' &&
                  formData.password !== formData.confirmPassword
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
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
              startIcon={<PersonAddIcon />}
              sx={{ ...glassAuthPrimary, mb: 1.5 }}
            >
              立即註冊
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              sx={glassAuthOutlined}
            >
              返回上一頁
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

export default RegisterPage
