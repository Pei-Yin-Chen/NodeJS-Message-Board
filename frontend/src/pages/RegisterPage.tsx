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
import GoogleIcon from '@mui/icons-material/Google'
import { useAuthStore } from '../store/useAuthStore'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { registerAction } = useAuthStore()
  const navigate = useNavigate()

  const handleClickShowPassword = () => setShowPassword(!showPassword)

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

    const result = await registerAction({
      email: formData.email,
      username: formData.username,
      password: formData.password,
    })

    if (result.success) {
      alert('註冊成功！請重新登入')
      navigate('/login')
    } else {
      setError(result.error)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper
          sx={{
            p: 4,
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#007bff',
              mb: 3,
              pb: 1,
              borderBottom: '2px solid #f0f2f5',
              textAlign: 'left',
            }}
          >
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
                value={formData.username}
                onChange={handleChange}
                size="small"
                required
              />
            </Box>

            <Box sx={{ mb: 2, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                電子郵件
              </Typography>
              <TextField
                fullWidth
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                size="small"
                required
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
                placeholder="請設定密碼"
                value={formData.password}
                onChange={handleChange}
                size="small"
                required
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

            {/* 💡 新增的再次確認密碼框 */}
            <Box sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                確認密碼
              </Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="請再次輸入密碼"
                value={formData.confirmPassword}
                onChange={handleChange}
                size="small"
                required
                // 如果密碼不一致，可以讓框線變紅
                error={
                  formData.confirmPassword !== '' &&
                  formData.password !== formData.confirmPassword
                }
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.2,
                borderRadius: '8px',
                bgcolor: '#28a745',
                fontWeight: 'bold',
                mb: 1.5,
                '&:hover': { bgcolor: '#218838' },
              }}
            >
              立即註冊
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              sx={{
                py: 1.2,
                borderRadius: '8px',
                color: '#666',
                borderColor: '#ccc',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { borderColor: '#999', bgcolor: '#f5f5f5' },
              }}
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
              sx={{
                py: 1,
                textTransform: 'none',
                borderColor: '#ddd',
                color: '#444',
                '&:hover': {
                  borderColor: '#bbb',
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              使用 Google 帳號登入
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegisterPage
