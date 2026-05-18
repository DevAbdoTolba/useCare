import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from '@mui/material';

/**
 * Reusable yes/no confirmation. TODO: tweak styling, support custom labels & danger variant.
 *
 * @param {{ open: boolean, title?: string, message?: string,
 *           onConfirm: () => void, onCancel: () => void,
 *           confirmLabel?: string, cancelLabel?: string }} props
 */
export default function ConfirmDialog({
  open, title = 'Confirm', message = 'Are you sure?',
  onConfirm, onCancel,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" disableElevation>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
