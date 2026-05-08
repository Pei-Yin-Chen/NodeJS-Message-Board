import React from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Chip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import EmailIcon from '@mui/icons-material/Email'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useAuthStore } from '../store/useAuthStore'

const ProfilePage = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!user) return null

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('zh-TW')
    : '未知'

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            margin: '0 auto 16px',
            fontSize: '40px',
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {user.username}
        </Typography>
        <Chip
          label="一般會員"
          color="primary"
          variant="outlined"
          sx={{ mb: 4 }}
        />

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ textAlign: 'left', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <EmailIcon sx={{ color: 'text.secondary', mr: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                電子郵件
              </Typography>
              <Typography variant="body1">{user.email || '未設定'}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <CalendarMonthIcon sx={{ color: 'text.secondary', mr: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                註冊日期
              </Typography>
              <Typography variant="body1">{joinDate}</Typography>
            </Box>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none', bgcolor: '#d32f2f' },
          }}
        >
          登出系統
        </Button>
      </Paper>
    </Container>
  )
}

export default ProfilePage
