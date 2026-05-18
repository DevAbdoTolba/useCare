import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

/**
 * @param {{ open: boolean, onClose: () => void, appointmentId?: number }} props
 */
export default function AppointmentDetailDialog({ open, onClose /*, appointmentId */ }) {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // Fields: date, time, status (dropdown), patient info, doctor info,
  // Doctor's Notes (textarea). Save button updates via api/appointments.js.
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Appointment detail</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">TODO: implement.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disableElevation>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
