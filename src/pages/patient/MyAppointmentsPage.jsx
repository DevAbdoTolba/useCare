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
  Rating,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { listAppointmentsForPatient } from '../../api/appointments.js';
import { useAuth } from '../../hooks/useAuth.js';
import { rateAppointment } from '../../lib/ratingsStore.js';
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
  const [ratingStars, setRatingStars] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [savedTick, setSavedTick] = useState(0); // bump to re-read the saved rating
  const [toast, setToast] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listAppointmentsForPatient(user?.id ?? 0)
      .then((appts) => {
        if (!mounted) return;
        const list = Array.isArray(appts) ? appts : [];
        setAppointments(list);
        // doctor name/specialty are embedded on each row — no extra lookups.
        const map = {};
        list.forEach((a) => {
          map[a.doctor_id] = { id: a.doctor_id, name: a.doctor_name, specialty: a.doctor_specialty };
        });
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
    if (!appt) return;
    setDetail(appt);
    const existing = appt.my_rating;
    setRatingStars(existing?.stars ?? 0);
    setRatingComment(existing?.comment ?? '');
    setRatingError('');
  };

  async function submitRating() {
    if (!detail) return;
    if (!ratingStars) { setRatingError('Please pick a star rating.'); return; }
    try {
      await rateAppointment(detail, ratingStars, ratingComment);
      const my = { stars: ratingStars, comment: ratingComment.trim() };
      setAppointments((prev) => prev.map((a) => (a.id === detail.id ? { ...a, my_rating: my } : a)));
      setDetail((d) => (d ? { ...d, my_rating: my } : d));
      setSavedTick((t) => t + 1);
      setToast('Thanks! Your rating was saved.');
    } catch (err) {
      setRatingError(err?.message || 'Could not save your rating.');
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  const detailDoctor = detail ? doctorById[detail.doctor_id] : null;
  // savedTick is referenced so this re-reads right after a rating is saved.
  const savedRating = detail && savedTick >= 0 ? detail.my_rating : null;

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

              {detail.status === 'completed' && (
                <>
                  <Divider textAlign="left">
                    <Typography variant="overline">Rate your visit</Typography>
                  </Divider>
                  <Stack spacing={1}>
                    <Rating
                      value={ratingStars}
                      onChange={(_e, next) => { setRatingStars(next ?? 0); setRatingError(''); }}
                    />
                    <TextField
                      label="Why this rating? (optional)"
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      fullWidth
                      multiline
                      minRows={2}
                    />
                    {ratingError && <Typography variant="caption" color="error">{ratingError}</Typography>}
                    {savedRating && (
                      <Typography variant="caption" color="success.main">
                        You rated this visit {savedRating.stars}/5.
                      </Typography>
                    )}
                  </Stack>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {detail?.status === 'completed' && (
            <Button variant="contained" disableElevation onClick={submitRating}>
              {savedRating ? 'Update rating' : 'Submit rating'}
            </Button>
          )}
          <Button onClick={() => setDetail(null)}>Close</Button>
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
