import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { glassCard, glassAuthOutlined, glassAuthLogout } from '../styles/glass'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  loadingLabel?: string
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => void
  confirmIcon?: React.ReactNode
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  loadingLabel = '處理中…',
  isLoading = false,
  onClose,
  onConfirm,
  confirmIcon,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      slotProps={{ paper: { sx: { ...glassCard, minWidth: 320 } } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText color="text.secondary">{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isLoading}
          sx={glassAuthOutlined}
        >
          取消
        </Button>
        <Button
          variant="outlined"
          onClick={onConfirm}
          disabled={isLoading}
          startIcon={confirmIcon}
          sx={glassAuthLogout}
        >
          {isLoading ? loadingLabel : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
