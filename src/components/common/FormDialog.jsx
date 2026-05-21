import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

export default function FormDialog({
  open, title = 'Form', message,
  onConfirm, onCancel,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>{message}</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" disableElevation>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
