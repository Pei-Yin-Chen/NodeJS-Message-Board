import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAuthStore } from '../store/useAuthStore'

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { user, isInitialized, loginAction } = useAuthStore()
  const navigate = useNavigate()

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
      setError(result.error || '登入失敗，請檢查您的帳號密碼')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          sx={{
            p: 4,
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
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
              width: '100%',
            }}
          >
            登入會員
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              {error}
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
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                size="small"
                required
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
                placeholder="請輸入密碼"
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.2,
                borderRadius: '8px',
                bgcolor: '#007bff',
                fontWeight: 'bold',
                mb: 1.5,
                textTransform: 'none',
                '&:hover': { bgcolor: '#0056b3' },
              }}
            >
              登入系統
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/register')}
              startIcon={<PersonAddIcon />}
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
              註冊新帳號
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
