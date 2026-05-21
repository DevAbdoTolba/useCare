import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Container,
  Stack,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { listAppointmentsForPatient } from '../../api/appointments.js';
import { getUser } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ProfileSummaryCard from '../../components/common/ProfileSummaryCard.jsx';
import DayHourGrid from '../../components/common/DayHourGrid.jsx';
import AppointmentCalendar from '../../components/common/AppointmentCalendar.jsx';
import { initialOf, timeLabel, STATUS_COLOR } from '../../lib/format.js';

export default function MyAppointmentsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctorById, setDoctorById] = useState({});
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [detail, setDetail] = useState(null);

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

  const dateStr = selectedDay.format('YYYY-MM-DD');

  const apptByHour = useMemo(() => {
    const map = {};
    appointments
      .filter((a) => a.date === dateStr)
      .forEach((a) => {
        const h = parseInt(String(a.time).split(':')[0], 10);
        if (!Number.isNaN(h)) map[h] = a;
      });
    return map;
  }, [appointments, dateStr]);

  const countsByDate = useMemo(() => {
    const m = {};
    appointments.forEach((a) => { m[a.date] = (m[a.date] || 0) + 1; });
    return m;
  }, [appointments]);

  const dayHasAppointments = Object.keys(apptByHour).length > 0;
  const doctorName = (id) => doctorById[id]?.name ?? `Doctor #${id}`;

  const getCell = (hour) => {
    const appt = apptByHour[hour];
    if (!appt) return {};
    return {
      selected: true,
      dim: true,
      chip: <Chip size="small" label={doctorName(appt.doctor_id)} />,
    };
  };

  const onHourClick = (hour) => {
    const appt = apptByHour[hour];
    if (appt) setDetail(appt);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  const detailDoctor = detail ? doctorById[detail.doctor_id] : null;

  return (
    <Container maxWidth="lg">
      <Stack spacing={3} marginTop={4} marginBottom={6}>
        <Typography variant="h4" component="h1">My appointments</Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
          <Box flexGrow={1}>
            <ProfileSummaryCard user={user}>
              {user?.phone_number && <Typography variant="body2" color="text.secondary">{user.phone_number}</Typography>}
              {user?.gender && <Typography variant="body2" color="text.secondary">{user.gender}</Typography>}
            </ProfileSummaryCard>
          </Box>

          <Card variant="outlined">
            <AppointmentCalendar
              value={selectedDay}
              onChange={(v) => v && setSelectedDay(v)}
              countsByDate={countsByDate}
            />
          </Card>
        </Stack>

        <Stack spacing={1}>
          <DayHourGrid selectedDay={selectedDay} getCell={getCell} onHourClick={onHourClick} />
          {!dayHasAppointments && (
            <Typography variant="body2" color="text.secondary">No appointments on this day.</Typography>
          )}
        </Stack>
      </Stack>

      {/* Read-only appointment detail (patient view) */}
      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} fullWidth maxWidth="xs">
        <DialogTitle>Appointment details</DialogTitle>
        <DialogContent>
          {detail && (
            <Stack spacing={2} marginTop={1}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>{initialOf(detailDoctor?.name ?? '?')}</Avatar>
                <Typography variant="h6">{detailDoctor?.name ?? `Doctor #${detail.doctor_id}`}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={detail.date} />
                <Chip label={timeLabel(detail.time)} variant="outlined" />
                <Chip label={detail.status} color={STATUS_COLOR[detail.status] ?? 'default'} />
              </Stack>

              <Divider textAlign="left">
                <Typography variant="overline">Doctor&apos;s notes</Typography>
              </Divider>
              <Typography variant="body2" color={detail.notes?.trim() ? 'text.primary' : 'text.secondary'}>
                {detail.notes?.trim() ? detail.notes : 'No notes from the doctor yet.'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
