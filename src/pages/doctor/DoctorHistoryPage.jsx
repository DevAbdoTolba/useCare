import { useEffect, useState } from 'react';
import {
  Container,
  Stack,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { listAppointmentsForDoctor, updateAppointment } from '../../api/appointments.js';
import { getUser } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.js';
import { APPOINTMENT_STATUSES } from '../../schema/schema.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AppointmentHistory from '../../components/common/AppointmentHistory.jsx';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Doctor's full, searchable, paginated history — with inline manage actions. */
export default function DoctorHistoryPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [patientById, setPatientById] = useState({});

  const [manageAppt, setManageAppt] = useState(null);
  const [editStatus, setEditStatus] = useState('pending');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listAppointmentsForDoctor(user?.id ?? 0)
      .then(async (appts) => {
        if (!mounted) return;
        setAppointments(Array.isArray(appts) ? appts : []);
        const ids = [...new Set((appts ?? []).map((a) => a.patient_id))];
        const patients = await Promise.all(ids.map((id) => getUser(id)));
        if (!mounted) return;
        const map = {};
        patients.forEach((p) => { if (p) map[p.id] = p; });
        setPatientById(map);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [user?.id]);

  function openManage(appt) {
    setManageAppt(appt);
    setEditStatus(appt.status ?? 'pending');
    setEditNotes(appt.notes ?? '');
  }

  async function saveManage() {
    if (!manageAppt) return;
    setSaving(true);
    try {
      await updateAppointment(manageAppt.id, { status: editStatus, notes: editNotes });
      setAppointments((prev) =>
        prev.map((a) => (a.id === manageAppt.id ? { ...a, status: editStatus, notes: editNotes } : a)),
      );
      setToast('Appointment updated.');
      setManageAppt(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <LoadingSpinner />
      </Container>
    );
  }

  const managePatient = manageAppt ? patientById[manageAppt.patient_id] : null;

  return (
    <Container maxWidth="md">
      <Stack spacing={3} marginTop={4} marginBottom={6}>
        <Typography variant="h4" component="h1">Appointment history</Typography>
        <AppointmentHistory
          appointments={appointments}
          getPersonName={(a) => patientById[a.patient_id]?.name ?? `Patient #${a.patient_id}`}
          personLabel="Patient"
          notesLabel="Visit notes"
          renderActions={(a) => (
            <Button size="small" variant="outlined" onClick={() => openManage(a)}>Manage</Button>
          )}
        />
      </Stack>

      <Dialog open={Boolean(manageAppt)} onClose={() => setManageAppt(null)} fullWidth maxWidth="xs">
        <DialogTitle>Manage appointment</DialogTitle>
        <DialogContent>
          {manageAppt && (
            <Stack spacing={2} marginTop={1}>
              <Typography variant="body2" color="text.secondary">
                {managePatient?.name ?? `Patient #${manageAppt.patient_id}`} · {manageAppt.date}
              </Typography>
              <TextField select label="Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value)} fullWidth>
                {APPOINTMENT_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{cap(s)}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Notes for the patient"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManageAppt(null)} disabled={saving}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={saveManage} disabled={saving}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </Container>
  );
}
