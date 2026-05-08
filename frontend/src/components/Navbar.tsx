import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const Navbar = () => {
  const navigate = useNavigate()

  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ backgroundColor: '#fff', color: '#333' }}
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
                  color="error"
                  variant="outlined"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  登出
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  登入
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                >
                  註冊
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
