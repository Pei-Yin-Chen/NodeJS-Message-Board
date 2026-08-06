import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
} from '@mui/material'
import { useState } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ConfirmDialog from './ConfirmDialog'
import { glassNavbar, glassNavOutlined, glassNavPrimary, glassNavLogout } from '../styles/glass'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const Navbar = () => {
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { user, logout } = useAuthStore()

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
    setLogoutOpen(false)
    navigate('/')
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ top: 0, zIndex: 1100, alignSelf: 'flex-start', width: '100%', ...glassNavbar, color: '#333' }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* 左側區域 */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1, // 圖示跟文字之間的間距
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <IconButton color="primary" sx={{ p: 0 }}>
              <HomeIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textAlign: 'left',
              }}
            >
              {user ? `Hi, ${user.username}` : '我的留言板'}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* 右側按鈕區域 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <IconButton
                  color="primary"
                  onClick={() => navigate('/profile')}
                >
                  <AccountCircle />
                </IconButton>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={() => setLogoutOpen(true)}
                  sx={glassNavLogout}
                >
                  登出
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate('/login')}
                  sx={glassNavOutlined}
                >
                  登入
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate('/register')}
                  sx={glassNavPrimary}
                >
                  註冊
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      <ConfirmDialog
        open={logoutOpen}
        title="登出確認"
        message="確定要登出嗎？"
        confirmLabel="登出"
        loadingLabel="登出中…"
        isLoading={isLoggingOut}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
        confirmIcon={<LogoutIcon />}
      />
    </AppBar>
  )
}

export default Navbar
