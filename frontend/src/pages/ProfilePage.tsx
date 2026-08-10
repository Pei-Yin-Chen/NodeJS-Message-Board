import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Avatar,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import EmailIcon from '@mui/icons-material/Email'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EditIcon from '@mui/icons-material/Edit'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  glassCard,
  glassAuthLogout,
  glassAuthPrimary,
  glassAuthOutlined,
  glassInput,
} from '../styles/glass'
import { useAuthStore } from '../store/useAuthStore'

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuthStore()
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editUsername, setEditUsername] = useState('')
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  if (!user) return null

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('zh-TW')
    : '未知'

  const handleStartEdit = () => {
    setEditUsername(user.username)
    setProfileError(null)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditUsername(user.username)
    setProfileError(null)
    setIsEditing(false)
  }

  const handleSaveUsername = async () => {
    const trimmed = editUsername.trim()

    if (!trimmed) {
      setProfileError('暱稱不能為空')
      return
    }

    if (trimmed.length < 2 || trimmed.length > 20) {
      setProfileError('暱稱長度需為 2～20 字')
      return
    }

    if (trimmed === user.username) {
      setIsEditing(false)
      return
    }

    setProfileError(null)
    setIsSaving(true)

    const result = await updateProfile(trimmed)
    setIsSaving(false)

    if (result.success) {
      setIsEditing(false)
    } else {
      setProfileError(result.error?.message || '更新失敗')
    }
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
    setLogoutOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={0} sx={{ ...glassCard, p: 4, textAlign: 'center' }}>
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

          {isEditing ? (
            <Box sx={{ mb: 2, px: 1 }}>
              <TextField
                fullWidth
                label="暱稱"
                value={editUsername}
                onChange={(e) => {
                  setEditUsername(e.target.value)
                  if (profileError) setProfileError(null)
                }}
                autoFocus
                size="small"
                disabled={isSaving}
                sx={glassInput}
                helperText="2～20 字"
              />
              {profileError && (
                <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
                  {profileError}
                </Alert>
              )}
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2, justifyContent: 'center' }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  sx={glassAuthOutlined}
                >
                  取消
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveUsername}
                  disabled={isSaving}
                  sx={glassAuthPrimary}
                >
                  {isSaving ? '儲存中…' : '儲存'}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                mb: 1,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {user.username}
              </Typography>
              <IconButton
                size="small"
                onClick={handleStartEdit}
                aria-label="編輯暱稱"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Chip
            label="一般會員"
            color="primary"
            variant="outlined"
            sx={{ mb: 4 }}
          />

          <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.4)' }} />

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
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => setLogoutOpen(true)}
            sx={glassAuthLogout}
          >
            登出系統
          </Button>
        </Paper>
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
    </>
  )
}

export default ProfilePage
