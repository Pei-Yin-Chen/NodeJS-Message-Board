import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  TextField,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import { useAuthStore } from '../store/useAuthStore'
import { useMessageStore } from '../store/useMessageStore'

interface IMessageProps {
  message: {
    _id: string
    content: string
    user: {
      username: string
    }
    createdAt: string
    updatedAt: string
  }
}

const MessageCard: React.FC<IMessageProps> = ({ message }) => {
  const { user: currentUser } = useAuthStore()
  const { deleteMessage, updateMessage } = useMessageStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  // 判斷是否為本人
  const isOwner =
    currentUser &&
    message.user &&
    currentUser.username === message.user.username

  const formattedDate = new Date(message.updatedAt).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleUpdate = async () => {
    if (!editContent.trim()) return
    await updateMessage(message._id, editContent)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm('確定要刪除這則留言嗎？')) {
      await deleteMessage(message._id)
    }
  }

  return (
    <Card elevation={1} sx={{ borderRadius: 3, mb: 2, position: 'relative' }}>
      <CardContent sx={{ p: '20px !important' }}>
        {/* 1. 左上半邊：Avatar + 使用者名稱 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon
              sx={{
                fontSize: 24,
                mr: 1.5,
                color: 'primary.main',
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {message.user?.username || '未知使用者'}
            </Typography>
          </Box>
          {isOwner && !isEditing && (
            <Box>
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* 2. 留言內容：獨自佔據中間區塊 */}
        <Box sx={{ px: 0.5, mb: 1 }}>
          {isEditing ? (
            <Stack spacing={1}>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                autoFocus
                size="small"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(message.content)
                  }}
                >
                  取消
                </Button>
                <Button size="small" variant="contained" onClick={handleUpdate}>
                  儲存
                </Button>
              </Box>
            </Stack>
          ) : (
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                color: 'text.secondary',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {message.content}
            </Typography>
          )}
        </Box>

        {/* 3. 右下角：顯示時間 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', fontStyle: 'italic' }}
          >
            {formattedDate}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MessageCard
