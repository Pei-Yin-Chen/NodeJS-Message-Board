import React, { useState } from 'react'
import { Alert, TextField, Button, Paper, Box, Typography } from '@mui/material'
import { glassCardLite, glassInput } from '../styles/glass'
import { useMessageStore } from '../store/useMessageStore'
import { useAuthStore } from '../store/useAuthStore'
import { MESSAGE_MAX_LENGTH } from '../constants/message'

const CreateMessage = () => {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addMessage } = useMessageStore()
  const { user } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setError('')
    setIsSubmitting(true)
    const result = await addMessage(content)
    setIsSubmitting(false)

    if (result.success) {
      setContent('')
    } else {
      setError(result.message || '發布失敗')
    }
  }

  if (!user) {
    return (
      <Paper sx={{ ...glassCardLite, p: 2, mb: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">請先登入後再發布留言</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ ...glassCardLite, p: 2, mb: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="想說些什麼嗎？"
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            if (error) setError('')
          }}
          slotProps={{ htmlInput: { maxLength: MESSAGE_MAX_LENGTH } }}
          helperText={`${content.length} / ${MESSAGE_MAX_LENGTH}`}
          sx={{ mb: 2, ...glassInput }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? '發布中...' : '發布留言'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default CreateMessage
