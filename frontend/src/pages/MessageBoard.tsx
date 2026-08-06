import { useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
  Stack,
  Skeleton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'
import CreateMessage from '../components/CreateMessage.tsx'
import MessageCard from '../components/MessageCard.tsx'
import { glassCard, glassCardLite, glassAuthPrimary } from '../styles/glass'
import { useAuthStore } from '../store/useAuthStore'
import { useMessageStore } from '../store/useMessageStore'

const SKELETON_COUNT = 3

const MessageSkeleton = () => (
  <Paper sx={{ ...glassCardLite, p: 2.5 }}>
    <Skeleton variant="circular" width={24} height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="30%" />
    <Skeleton variant="text" />
    <Skeleton variant="text" width="80%" />
  </Paper>
)

const MessageBoard = () => {
  const { messages, isFetching, error, fetchMessages } = useMessageStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (messages.length === 0) {
      fetchMessages()
    }
  }, [fetchMessages, messages.length])

  const showSkeletons = isFetching && messages.length === 0

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        最新留言
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 留言發布區 */}
      {user ? (
        <CreateMessage />
      ) : (
        <Paper
          sx={{
            ...glassCard,
            p: 4,
            mb: 4,
            textAlign: 'center',
            borderStyle: 'dashed',
            borderColor: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            想分享你的想法嗎？登入後即可發表留言
          </Typography>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={glassAuthPrimary}
          >
            立即登入
          </Button>
        </Paper>
      )}

      <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.35)' }} />

      {/* 留言列表 */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {showSkeletons &&
          Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <MessageSkeleton key={`skeleton-${i}`} />
          ))}

        {messages.map((msg) => (
          <MessageCard key={msg._id} message={msg} />
        ))}

        {!isFetching && messages.length === 0 && (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography color="text.secondary">
              目前還沒有任何留言。快來搶頭香吧！
            </Typography>
          </Box>
        )}
      </Stack>
    </Container>
  )
}

export default MessageBoard
