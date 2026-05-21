import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Container,
  Stack,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { listAppointmentsForPatient } from '../../api/appointments.js';
import { getUser } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const HOURS = Array.from({ length: 24 }, (_, h) => h);          // 0..23
const GRID_ROWS = [0, 1, 2];                                    // 3 rows
const GRID_COLS = 8;                                            // 8 cols → 24 cells

const STATUS_COLOR = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'default',
  completed: 'info',
};

const hourLabel = (h) => dayjs().hour(h).minute(0).format('h A');
const timeLabel = (t) => dayjs(`2000-01-01 ${t}`).format('h:mm A');
const initialOf = (name) => (name?.trim()?.[0] ?? '?').toUpperCase();

export default function MyAppointmentsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctorById, setDoctorById] = useState({});
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [detail, setDetail] = useState(null); // the appointment shown in the dialog

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

  // hour (0..23) -> appointment on the selected day
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

  const dayHasAppointments = Object.keys(apptByHour).length > 0;
  const doctorName = (id) => doctorById[id]?.name ?? `Doctor #${id}`;

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

        {/* ---- Profile (left) + day calendar (right) ---- */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
          <Box flexGrow={1}>
            <Card variant="outlined">
              <CardContent>
                {user ? (
                  <Stack spacing={2} alignItems="center">
                    <Avatar>{initialOf(user.name)}</Avatar>
                    <Typography variant="h6">{user.name}</Typography>
                    <Stack spacing={0.5} alignItems="center">
                      {user.email && <Typography variant="body2" color="text.secondary">{user.email}</Typography>}
                      {user.phone_number && <Typography variant="body2" color="text.secondary">{user.phone_number}</Typography>}
                      {user.gender && <Typography variant="body2" color="text.secondary">{user.gender}</Typography>}
                    </Stack>
                  </Stack>
                ) : (
                  <EmptyState title="Not signed in" message="Log in to see your appointments." />
                )}
              </CardContent>
            </Card>
          </Box>

          <Card variant="outlined">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar value={selectedDay} onChange={(v) => v && setSelectedDay(v)} />
            </LocalizationProvider>
          </Card>
        </Stack>

        {/* ---- 24-hour day grid (8 cols x 3 rows) ---- */}
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {selectedDay.format('dddd, MMM D, YYYY')}
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableBody>
                {GRID_ROWS.map((row) => (
                  <TableRow key={row}>
                    {Array.from({ length: GRID_COLS }, (_, col) => {
                      const hour = row * GRID_COLS + col;
                      const appt = apptByHour[hour];
                      const reserved = Boolean(appt);
                      return (
                        <TableCell
                          key={hour}
                          align="center"
                          onClick={reserved ? () => setDetail(appt) : undefined}
                          selected={reserved}
                        >
                          <Stack spacing={0.5} alignItems="center">
                            <Typography variant="caption" color={reserved ? 'text.disabled' : 'text.secondary'}>
                              {hourLabel(hour)}
                            </Typography>
                            {reserved && (
                              <Chip
                                size="small"
                                label={doctorName(appt.doctor_id)}
                                onClick={() => setDetail(appt)}
                              />
                            )}
                          </Stack>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!dayHasAppointments && (
            <Typography variant="body2" color="text.secondary">
              No appointments on this day.
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* ---- Appointment detail dialog ---- */}
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
