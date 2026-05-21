import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, 
  Stack, TextField, Select, MenuItem, InputLabel, FormControl, Card, CardContent 
} from '@mui/material';
import dayjs from 'dayjs';
import { getAppointment, updateAppointment } from '../../api/appointments.js';
import { getUser } from '../../api/users.js';
import { getSpecialty } from '../../api/specialties.js';
import { APPOINTMENT_STATUSES } from '../../schema/schema.js';
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
        
        const [pat, doc] = await Promise.all([
          getUser(appt.patient_id),
          getUser(appt.doctor_id)
        ]);
        
        let spec = null;
        if (doc && doc.specialty_id) {
          spec = await getSpecialty(doc.specialty_id);
        }

        if (mounted) {
          setAppointment(appt);
          setPatient(pat);
          setDoctor(doc);
          setSpecialty(spec);
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

            {/* Status */}
            <FormControl fullWidth>
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
                <Typography variant="body2"><strong>Phone:</strong> {patient.phone_number || 'N/A'}</Typography>
                <Typography variant="body2"><strong>Age:</strong> {calculateAge(patient.date_of_birth)}</Typography>
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
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button 
          variant="contained" 
          disableElevation 
          onClick={handleSave} 
          disabled={loading || saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
