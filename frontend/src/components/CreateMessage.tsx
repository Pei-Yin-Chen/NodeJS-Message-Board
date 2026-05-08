import React, { useState } from 'react'
import { TextField, Button, Paper, Box, Typography } from '@mui/material'
import { useMessageStore } from '../store/useMessageStore'
import { useAuthStore } from '../store/useAuthStore'

const CreateMessage = () => {
  const [content, setContent] = useState('')
  const { addMessage, loading } = useMessageStore()
  const { user } = useAuthStore() // 用來檢查是否登入

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const result = await addMessage(content)
    if (result.success) {
      setContent('') // 清空輸入框
    } else {
      alert(result.message || '發布失敗')
    }
  }

  if (!user) {
    return (
      <Paper sx={{ p: 2, mb: 4, bgcolor: '#f8f9fa', textAlign: 'center' }}>
        <Typography color="text.secondary">請先登入後再發布留言</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="想說些什麼嗎？"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !content.trim()}
          >
            {loading ? '發布中...' : '發布留言'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default CreateMessage
