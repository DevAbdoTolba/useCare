import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Container,
  Stack,
  Box,
  Typography,
  Card,
  Avatar,
  Chip,
  Divider,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { listAppointmentsForDoctor, updateAppointment } from '../../api/appointments.js';
import { getUser } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.js';
import { APPOINTMENT_STATUSES } from '../../schema/schema.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ProfileSummaryCard from '../../components/common/ProfileSummaryCard.jsx';
import DayHourGrid from '../../components/common/DayHourGrid.jsx';
import { initialOf, timeLabel, hourLabel, ageFromDob, STATUS_COLOR } from '../../lib/format.js';

// --- Standalone localStorage store for the doctor's "open" hours (mock). ---
const AVAIL_KEY = 'usecare_doctor_availability';
const availKey = (doctorId, date) => `${doctorId}_${date}`;
function readAvailability() {
  try { return JSON.parse(localStorage.getItem(AVAIL_KEY)) || {}; } catch { return {}; }
}
function getOpenHours(doctorId, date) {
  return readAvailability()[availKey(doctorId, date)] ?? [];
}
function setOpenHours(doctorId, date, hours) {
  const all = readAvailability();
  all[availKey(doctorId, date)] = hours;
  try { localStorage.setItem(AVAIL_KEY, JSON.stringify(all)); } catch { /* ignore */ }
}

export default function DoctorCalendarPage() {
  const { user } = useAuth();
  const doctorId = user?.id;

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [patientById, setPatientById] = useState({});
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [openHours, setOpenHoursState] = useState([]);

  const [confirmHour, setConfirmHour] = useState(null);
  const [detail, setDetail] = useState(null);
  const [editStatus, setEditStatus] = useState('pending');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const dateStr = selectedDay.format('YYYY-MM-DD');

  useEffect(() => {
    if (!doctorId) { setLoading(false); return undefined; }
    let mounted = true;
    setLoading(true);
    listAppointmentsForDoctor(doctorId)
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
  }, [doctorId]);

  useEffect(() => {
    if (doctorId) setOpenHoursState(getOpenHours(doctorId, dateStr));
  }, [doctorId, dateStr]);

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

  const patientName = (id) => patientById[id]?.name ?? `Patient #${id}`;

  function persistOpenHours(hours) {
    setOpenHoursState(hours);
    setOpenHours(doctorId, dateStr, hours);
  }

  const getCell = (hour) => {
    const appt = apptByHour[hour];
    if (appt) {
      return {
        selected: true,
        dim: true,
        chip: <Chip size="small" label={patientName(appt.patient_id)} color={STATUS_COLOR[appt.status] ?? 'default'} />,
      };
    }
    if (openHours.includes(hour)) {
      return { selected: true, chip: <Chip size="small" variant="outlined" color="success" label="Open" /> };
    }
    return {};
  };

  const onHourClick = (hour) => {
    const appt = apptByHour[hour];
    if (appt) {
      setDetail(appt);
      setEditStatus(appt.status ?? 'pending');
      setEditNotes(appt.notes ?? '');
      return;
    }
    if (openHours.includes(hour)) {
      persistOpenHours(openHours.filter((h) => h !== hour));
      return;
    }
    setConfirmHour(hour);
  };

  function confirmSetAvailable() {
    if (confirmHour == null) return;
    persistOpenHours([...openHours, confirmHour].sort((a, b) => a - b));
    setConfirmHour(null);
  }

  async function saveAppointment() {
    if (!detail) return;
    setSaving(true);
    try {
      await updateAppointment(detail.id, { status: editStatus, notes: editNotes });
      setAppointments((prev) =>
        prev.map((a) => (a.id === detail.id ? { ...a, status: editStatus, notes: editNotes } : a)),
      );
      setToast('Appointment updated.');
      setDetail(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  const detailPatient = detail ? patientById[detail.patient_id] : null;
  const detailAge = detailPatient ? ageFromDob(detailPatient.date_of_birth) : null;

  return (
    <Container maxWidth="lg">
      <Stack spacing={3} marginTop={2} marginBottom={6}>
        <Typography variant="h4" component="h1">My day</Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
          <Box flexGrow={1}>
            <ProfileSummaryCard user={user}>
              {user?.description && <Typography variant="body2" color="text.secondary">{user.description}</Typography>}
              {user?.status && <Chip size="small" label={user.status} color={user.status === 'approved' ? 'success' : 'warning'} />}
            </ProfileSummaryCard>
          </Box>

          <Card variant="outlined">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar value={selectedDay} onChange={(v) => v && setSelectedDay(v)} />
            </LocalizationProvider>
          </Card>
        </Stack>

        <Stack spacing={1}>
          <DayHourGrid
            selectedDay={selectedDay}
            getCell={getCell}
            onHourClick={onHourClick}
            caption="tap a free hour to open it for booking"
          />
          <Typography variant="caption" color="text.secondary">
            Booked hours show the patient; green “Open” hours are waiting for a patient to pick (tap again to disable).
          </Typography>
        </Stack>
      </Stack>

      {/* Confirm "set as available" */}
      <Dialog open={confirmHour != null} onClose={() => setConfirmHour(null)}>
        <DialogTitle>Open this hour?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmHour != null
              ? `Set ${hourLabel(confirmHour)} on ${selectedDay.format('MMM D')} as available for appointments?`
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmHour(null)}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={confirmSetAvailable}>Set available</Button>
        </DialogActions>
      </Dialog>

      {/* Reverse appointment dialog (doctor view: editable notes + status) */}
      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} fullWidth maxWidth="xs">
        <DialogTitle>Manage appointment</DialogTitle>
        <DialogContent>
          {detail && (
            <Stack spacing={2} marginTop={1}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>{initialOf(detailPatient?.name ?? '?')}</Avatar>
                <Box>
                  <Typography variant="h6">{detailPatient?.name ?? `Patient #${detail.patient_id}`}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[detailPatient?.phone_number, detailAge != null ? `${detailAge} yrs` : null].filter(Boolean).join(' · ')}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={detail.date} />
                <Chip label={timeLabel(detail.time)} variant="outlined" />
              </Stack>

              <TextField select label="Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value)} fullWidth>
                {APPOINTMENT_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                ))}
              </TextField>

              <Divider textAlign="left">
                <Typography variant="overline">Doctor&apos;s notes</Typography>
              </Divider>
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
          <Button onClick={() => setDetail(null)} disabled={saving}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={saveAppointment} disabled={saving}>Save</Button>
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
