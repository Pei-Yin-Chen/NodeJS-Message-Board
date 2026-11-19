import React, { useState, memo } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import { glassCardLite, glassCardContent, glassInput, glassCard, glassAuthOutlined, glassAuthLogout } from '../styles/glass'
import { useAuthStore } from '../store/useAuthStore'
import { useMessageStore } from '../store/useMessageStore'
import { MESSAGE_MAX_LENGTH } from '../constants/message'

interface IMessageProps {
  message: {
    _id: string
    content: string
    user: {
      _id: string
      username: string
    }
    createdAt: string
    updatedAt: string
  }
}

const MessageCard: React.FC<IMessageProps> = ({ message }) => {
  const { user: currentUser } = useAuthStore()
  const deleteMessage = useMessageStore((state) => state.deleteMessage)
  const updateMessage = useMessageStore((state) => state.updateMessage)

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [editError, setEditError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 判斷是否為本人
  const isOwner =
    currentUser &&
    message.user &&
    String(currentUser.id) === String(message.user._id)

  const formattedDate = new Date(message.updatedAt).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleUpdate = async () => {
    if (!editContent.trim() || isSaving) return

    setEditError(null)
    setIsSaving(true)
    const result = await updateMessage(message._id, editContent)
    setIsSaving(false)

    if (result.success) {
      setIsEditing(false)
    } else {
      setEditError(result.message || '更新失敗')
    }
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    await deleteMessage(message._id)
    setIsDeleting(false)
    setDeleteOpen(false)
  }

  return (
    <>
    <Card
      elevation={0}
      sx={{
        ...glassCardLite,
        mb: 2,
        position: 'relative',
        contentVisibility: 'auto',
        containIntrinsicSize: '0 140px',
      }}
    >
      <CardContent sx={{ ...glassCardContent, p: '20px !important' }}>
        {/* 左上半邊：頭像 + 使用者名稱 */}
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
              <IconButton
                size="small"
                onClick={() => {
                  setEditContent(message.content)
                  setEditError(null)
                  setIsEditing(true)
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => setDeleteOpen(true)}>
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
                onChange={(e) => {
                  setEditContent(e.target.value)
                  if (editError) setEditError(null)
                }}
                autoFocus
                size="small"
                disabled={isSaving}
                slotProps={{ htmlInput: { maxLength: MESSAGE_MAX_LENGTH } }}
                helperText={`${editContent.length} / ${MESSAGE_MAX_LENGTH}`}
                sx={glassInput}
              />
              {editError && (
                <Alert severity="error">{editError}</Alert>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(message.content)
                    setEditError(null)
                  }}
                  disabled={isSaving}
                >
                  取消
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={isSaving || !editContent.trim()}
                >
                  {isSaving ? '儲存中…' : '儲存'}
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

    <Dialog
      open={deleteOpen}
      onClose={() => !isDeleting && setDeleteOpen(false)}
      slotProps={{ paper: { sx: { ...glassCard, minWidth: 320 } } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>刪除留言</DialogTitle>
      <DialogContent>
        <DialogContentText color="text.secondary">
          確定要刪除這則留言嗎？此操作無法復原。
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setDeleteOpen(false)}
          disabled={isDeleting}
          sx={glassAuthOutlined}
        >
          取消
        </Button>
        <Button
          variant="outlined"
          onClick={handleDeleteConfirm}
          disabled={isDeleting}
          startIcon={<DeleteIcon />}
          sx={glassAuthLogout}
        >
          {isDeleting ? '刪除中…' : '刪除'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

export default memo(MessageCard)
