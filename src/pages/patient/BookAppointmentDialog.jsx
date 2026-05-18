import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

/**
 * @param {{ open: boolean, onClose: () => void, slot?: { doctor_id: number, date: string, time: string } }} props
 */
export default function BookAppointmentDialog({ open, onClose /*, slot */ }) {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // Confirm booking, optional patient note. Save calls api/appointments.js -> createAppointment.
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Book appointment</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">TODO: implement.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disableElevation>Book</Button>
      </DialogActions>
    </Dialog>
  );
}
