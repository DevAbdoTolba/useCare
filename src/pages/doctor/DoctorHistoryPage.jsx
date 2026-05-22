import { useEffect, useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import { listAppointmentsForDoctor } from '../../api/appointments.js';
import { getUser } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AppointmentHistory from '../../components/common/AppointmentHistory.jsx';

/** Doctor's full, searchable, paginated appointment history (same component as the patient's). */
export default function DoctorHistoryPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [patientById, setPatientById] = useState({});

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
          getPersonName={(a) => patientById[a.patient_id]?.name ?? `Patient #${a.patient_id}`}
          personLabel="Patient"
          notesLabel="Visit notes"
        />
      </Stack>
    </Container>
  );
}
