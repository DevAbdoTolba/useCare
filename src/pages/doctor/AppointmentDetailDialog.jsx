import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  Stack, TextField, Select, MenuItem, InputLabel, FormControl, Card, CardContent, Alert
} from '@mui/material';
import dayjs from 'dayjs';
import { getAppointment, updateAppointment } from '../../api/appointments.js';
import { APPOINTMENT_STATUSES } from '../../schema/schema.js';
import { shownStatus } from '../../lib/format.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

/**
 * @param {{ open: boolean, onClose: () => void, appointmentId?: number }} props
 */
export default function AppointmentDetailDialog({ open, onClose, appointmentId }) {
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [specialty, setSpecialty] = useState(null);
  
  // Editable fields
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      if (!appointmentId) return;
      try {
        setLoading(true);
        const appt = await getAppointment(appointmentId);
        if (!appt) return;

        // Names/specialty are embedded on the appointment row, so no extra
        // (and, for a doctor, unauthorized) user lookups are needed.
        if (mounted) {
          setAppointment(appt);
          setPatient({ name: appt.patient_name, email: appt.patient_email });
          setDoctor({ name: appt.doctor_name });
          setSpecialty(appt.doctor_specialty ? { name: appt.doctor_specialty } : null);
          setStatus(appt.status || '');
          setNotes(appt.notes || '');
        }
      } catch (err) {
        console.error('Failed to load appointment details', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (open) {
      fetchData();
    }
    
    return () => { mounted = false; };
  }, [open, appointmentId]);

  const dStatus = appointment ? shownStatus(appointment) : null;
  const isUnpaid = dStatus === 'unpaid';
  const isOutdated = dStatus === 'outdated';
  const locked = isUnpaid || isOutdated; // can't edit status/notes in either state

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAppointment(appointmentId, { status, notes });
      onClose(); // This will trigger the parent (DaySchedulePage) to rerender or user will reload
    } catch (err) {
      console.error('Failed to update appointment', err);
    } finally {
      setSaving(false);
    }
  };

  // Unpaid bookings can't be managed — the only thing the doctor may do is cancel.
  const handleCancelAppointment = async () => {
    try {
      setSaving(true);
      await updateAppointment(appointmentId, { status: 'cancelled' });
      onClose();
    } catch (err) {
      console.error('Failed to cancel appointment', err);
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    return dayjs().diff(dayjs(dob), 'year');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Appointment detail</DialogTitle>
      
      {loading ? (
        <DialogContent>
          <LoadingSpinner />
        </DialogContent>
      ) : appointment && patient && doctor ? (
        <DialogContent dividers>
          <Stack spacing={3} mt={1}>
            
            {/* Date + Time */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Date"
                value={appointment.date}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Time"
                value={appointment.time}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Stack>

            {isOutdated && (
              <Alert severity="warning">
                This appointment is outdated — the time passed without confirmation. It can no
                longer be managed.
              </Alert>
            )}
            {isUnpaid && (
              <Alert severity="info">
                Waiting for the patient to pay. You can&apos;t manage this appointment until it&apos;s
                paid — you can only cancel it.
              </Alert>
            )}

            {/* Status */}
            <FormControl fullWidth disabled={locked}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                {APPOINTMENT_STATUSES.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Patient Info Card */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Patient</Typography>
                <Typography variant="body2"><strong>Name:</strong> {patient.name}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {patient.email || 'N/A'}</Typography>
              </CardContent>
            </Card>

            {/* Doctor Info Card */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Doctor</Typography>
                <Typography variant="body2"><strong>Name:</strong> {doctor.name}</Typography>
                <Typography variant="body2"><strong>Specialty:</strong> {specialty ? specialty.name : 'Unknown'}</Typography>
              </CardContent>
            </Card>

            {/* Doctor's Notes */}
            <TextField
              label="Doctor's Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              disabled={locked}
              placeholder="Add your clinical notes here..."
            />

          </Stack>
        </DialogContent>
      ) : (
        <DialogContent>
          <Typography color="error">Failed to load appointment data.</Typography>
        </DialogContent>
      )}

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Close</Button>
        {isOutdated ? null : isUnpaid ? (
          <Button color="error" onClick={handleCancelAppointment} disabled={loading || saving}>
            {saving ? 'Cancelling…' : 'Cancel appointment'}
          </Button>
        ) : (
          <Button
            variant="contained"
            disableElevation
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
