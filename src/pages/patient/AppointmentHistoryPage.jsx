import { useEffect, useState } from 'react';
import { Container, Stack, Typography, Button, Snackbar, Alert } from '@mui/material';
import { listAppointmentsForPatient, cancelAppointment } from '../../api/appointments.js';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AppointmentHistory from '../../components/common/AppointmentHistory.jsx';

/** Patient's full, searchable, paginated appointment history. */
export default function AppointmentHistoryPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctorById, setDoctorById] = useState({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listAppointmentsForPatient(user?.id ?? 0)
      .then((appts) => {
        if (!mounted) return;
        const list = Array.isArray(appts) ? appts : [];
        setAppointments(list);
        const map = {};
        list.forEach((a) => { map[a.doctor_id] = { id: a.doctor_id, name: a.doctor_name }; });
        setDoctorById(map);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [user?.id]);

  async function handleCancel(appt) {
    await cancelAppointment(appt.id);
    setAppointments((prev) => prev.map((a) => (a.id === appt.id ? { ...a, status: 'cancelled' } : a)));
    setToast('Appointment request cancelled.');
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Stack spacing={3} marginTop={4} marginBottom={6}>
        <Typography variant="h4" component="h1">Appointment history</Typography>
        <AppointmentHistory
          appointments={appointments}
          getPersonName={(a) => doctorById[a.doctor_id]?.name ?? `Doctor #${a.doctor_id}`}
          personLabel="Doctor"
          notesLabel="Doctor's notes"
          renderActions={(a) => (
            // A patient can still back out while it's only "requested" (pending).
            a.status === 'pending' ? (
              <Button size="small" color="error" onClick={() => handleCancel(a)}>
                Cancel request
              </Button>
            ) : null
          )}
        />
      </Stack>

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
