import React, { useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Stack,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CreateMessage from '../components/CreateMessage.tsx'
import MessageCard from '../components/MessageCard.tsx'
import { useAuthStore } from '../store/useAuthStore'
import { useMessageStore } from '../store/useMessageStore'

const MessageBoard = () => {
  const { messages, loading, error, fetchMessages } = useMessageStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  if (loading && messages.length === 0) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* <Box sx={{ my: 4 }}> */}
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
          variant="outlined"
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            borderRadius: '15px',
            borderStyle: 'dashed',
            bgcolor: '#f8f9fa',
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            想分享你的想法嗎？登入後即可發表留言
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: '20px',
              px: 4,
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            立即登入
          </Button>
        </Paper>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* 留言列表 */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {messages.map((msg) => (
          <MessageCard key={msg._id} message={msg} />
        ))}
        {!loading && messages.length === 0 && (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography color="text.secondary">
              目前還沒有任何留言。快來搶頭香吧！
            </Typography>
          </Box>
        )}
      </Stack>
      {/* </Box> */}
    </Container>
  )
}

export default MessageBoard
