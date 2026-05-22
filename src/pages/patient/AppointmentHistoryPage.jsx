import { useEffect, useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import { listAppointmentsForPatient } from '../../api/appointments.js';
import { getUser } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AppointmentHistory from '../../components/common/AppointmentHistory.jsx';

/** Patient's full, searchable, paginated appointment history. */
export default function AppointmentHistoryPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctorById, setDoctorById] = useState({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listAppointmentsForPatient(user?.id ?? 0)
      .then(async (appts) => {
        if (!mounted) return;
        setAppointments(Array.isArray(appts) ? appts : []);
        const ids = [...new Set((appts ?? []).map((a) => a.doctor_id))];
        const docs = await Promise.all(ids.map((id) => getUser(id)));
        if (!mounted) return;
        const map = {};
        docs.forEach((d) => { if (d) map[d.id] = d; });
        setDoctorById(map);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [user?.id]);

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
        />
      </Stack>
    </Container>
  );
}
