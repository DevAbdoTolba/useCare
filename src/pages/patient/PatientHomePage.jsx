import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Container,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Rating,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Chip,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled } from '@mui/material/styles';

import { listDoctors } from '../../api/users.js';
import { listSpecialties } from '../../api/specialties.js';
import { listAvailabilityForDoctor } from '../../api/availability.js';
import { listAppointmentsForDoctor } from '../../api/appointments.js';
import { createAppointment } from '../../api/appointments.js';
import { useAuth } from '../../hooks/useAuth.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const ALL_SPECIALTIES = 'all';
const SLOT_MINUTES = 30;
const SLOT_PAGE_OPTIONS = [5, 10, 25];

// Week picker (MUI docs pattern): a styled day that paints the whole hovered /
// selected week as a connected strip. All colors come from the MUI theme
// palette, so it re-themes via the theme config — and uses no `sx` prop.
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
})(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover, &:focus': { backgroundColor: theme.palette.primary.main },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary.light,
    '&:hover, &:focus': { backgroundColor: theme.palette.primary.light },
  }),
  ...(day.day() === 0 && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(day.day() === 6 && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));

const isInSameWeek = (a, b) => {
  if (b == null) return false;
  return a.startOf('week').isSame(b.startOf('week'), 'day');
};

function Day({ day, selectedDay, hoveredDay, ...other }) {
  return (
    <CustomPickersDay
      {...other}
      day={day}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

/** Build 30-minute slots from a doctor's available days, skipping booked times. */
function buildSlots(availabilities, appointments) {
  const booked = new Set(
    appointments
      .filter((a) => a.status !== 'cancelled')
      .map((a) => `${a.date} ${a.time}`),
  );

  const slots = [];
  availabilities
    .filter((a) => a.is_available)
    .forEach((a) => {
      let t = dayjs(`${a.date} ${a.start_time}`);
      const end = dayjs(`${a.date} ${a.end_time}`);
      while (t.isBefore(end)) {
        const time24 = t.format('HH:mm');
        const key = `${a.date} ${time24}`;
        if (!booked.has(key)) {
          slots.push({
            id: key,
            date: a.date,
            time24,
            dateLabel: t.format('ddd, MMM D'),
            timeLabel: t.format('h:mm A'),
          });
        }
        t = t.add(SLOT_MINUTES, 'minute');
      }
    });

  return slots.sort((x, y) => `${x.date} ${x.time24}`.localeCompare(`${y.date} ${y.time24}`));
}

export default function PatientHomePage() {
  const { user } = useAuth();

  // Initial data
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table search + applied filters
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState(ALL_SPECIALTIES);
  const [weekStart, setWeekStart] = useState(null); // dayjs | null — filters the slots

  // Filter dialog (draft state, committed on Apply)
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftSpecialty, setDraftSpecialty] = useState(ALL_SPECIALTIES);
  const [draftDay, setDraftDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Selected doctor card
  const [slotsByDoctor, setSlotsByDoctor] = useState({}); // doctorId -> slots[]
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [requested, setRequested] = useState(() => new Set()); // slot ids with a pending request
  const [slotPage, setSlotPage] = useState(0);
  const [slotsPerPage, setSlotsPerPage] = useState(SLOT_PAGE_OPTIONS[0]);

  // Doctor table pagination
  const [docPage, setDocPage] = useState(0);
  const [docsPerPage, setDocsPerPage] = useState(SLOT_PAGE_OPTIONS[0]);

  // Booking confirm dialog + feedback
  const [pendingSlot, setPendingSlot] = useState(null);
  const [notes, setNotes] = useState(''); // "Reason for visit" (optional)
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState('');

  function closeBookingDialog() {
    setPendingSlot(null);
    setNotes('');
  }

  useEffect(() => {
    let mounted = true;
    Promise.all([listDoctors(), listSpecialties()])
      .then(async ([docs, specs]) => {
        if (!mounted) return;
        setDoctors(docs);
        setSpecialties(specs);
        // Preload every doctor's open slots so the week filter can narrow the
        // doctor list (not just the selected card).
        const entries = await Promise.all(
          docs.map(async (d) => {
            const [avail, appts] = await Promise.all([
              listAvailabilityForDoctor(d.id),
              listAppointmentsForDoctor(d.id),
            ]);
            return [d.id, buildSlots(avail, appts)];
          }),
        );
        if (mounted) setSlotsByDoctor(Object.fromEntries(entries));
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const specialtyNameById = useMemo(() => {
    const map = new Map();
    specialties.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [specialties]);

  const slotsInWeek = (doctorId, ws) =>
    (slotsByDoctor[doctorId] ?? []).some((s) => dayjs(s.date).startOf('week').isSame(ws, 'day'));

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();
    return doctors.filter((d) => {
      const matchesName = !term || d.name.toLowerCase().includes(term);
      const matchesSpecialty =
        specialtyFilter === ALL_SPECIALTIES || d.specialty_id === specialtyFilter;
      const matchesWeek = !weekStart || slotsInWeek(d.id, weekStart);
      return matchesName && matchesSpecialty && matchesWeek;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, search, specialtyFilter, weekStart, slotsByDoctor]);

  // Slots for the selected doctor, narrowed to the chosen week if any.
  const slots = useMemo(
    () => (selectedDoctor ? (slotsByDoctor[selectedDoctor.id] ?? []) : []),
    [selectedDoctor, slotsByDoctor],
  );
  const visibleSlots = useMemo(() => {
    if (!weekStart) return slots;
    return slots.filter((s) => dayjs(s.date).startOf('week').isSame(weekStart, 'day'));
  }, [slots, weekStart]);

  // Reset to the first page whenever the visible slot set changes.
  useEffect(() => { setSlotPage(0); }, [weekStart, selectedDoctor, slotsPerPage]);

  const pagedSlots = useMemo(
    () => visibleSlots.slice(slotPage * slotsPerPage, slotPage * slotsPerPage + slotsPerPage),
    [visibleSlots, slotPage, slotsPerPage],
  );

  // Reset the table to the first page whenever the filtered set changes.
  useEffect(() => { setDocPage(0); }, [search, specialtyFilter, weekStart, docsPerPage]);

  const pagedDoctors = useMemo(
    () => filteredDoctors.slice(docPage * docsPerPage, docPage * docsPerPage + docsPerPage),
    [filteredDoctors, docPage, docsPerPage],
  );

  function handleViewDoctor(doctor) {
    setSelectedDoctor(doctor);
    setRequested(new Set());
    setSlotPage(0);
  }

  function openFilters() {
    setDraftSpecialty(specialtyFilter);
    setDraftDay(weekStart);
    setFilterOpen(true);
  }

  function applyFilters() {
    setSpecialtyFilter(draftSpecialty);
    setWeekStart(draftDay ? draftDay.startOf('week') : null);
    setFilterOpen(false);
  }

  function clearFiltersInDialog() {
    setDraftSpecialty(ALL_SPECIALTIES);
    setDraftDay(null);
  }

  async function confirmBooking() {
    if (!pendingSlot || !selectedDoctor) return;
    setBooking(true);
    try {
      await createAppointment({
        patient_id: user?.id ?? 0,
        doctor_id: selectedDoctor.id,
        date: pendingSlot.date,
        time: pendingSlot.time24,
        notes: notes.trim(),
        status: 'pending',
      });
      // Mark the slot as "requested" — keeps it visible with an indeterminate
      // (in-progress) checkbox rather than removing it.
      setRequested((prev) => new Set(prev).add(pendingSlot.id));
      setToast(`Requested ${pendingSlot.dateLabel} at ${pendingSlot.timeLabel} with ${selectedDoctor.name}.`);
      closeBookingDialog();
    } finally {
      setBooking(false);
    }
  }

  const weekLabel = weekStart
    ? `${weekStart.format('MMM D')} – ${weekStart.endOf('week').format('MMM D')}`
    : null;
  const filtersActive = specialtyFilter !== ALL_SPECIALTIES || weekStart != null;

  return (
    <Container maxWidth="lg">
      <Stack spacing={3} marginTop={4} marginBottom={6}>
        <Typography variant="h4" component="h1">Find a doctor</Typography>

        {/* ---- Doctor card viewer ---- */}
        {!selectedDoctor ? (
          <Card variant="outlined">
            <CardContent>
              <EmptyState
                title="No doctor selected"
                message="Select a doctor from the table below to see their details and available appointments."
              />
            </CardContent>
          </Card>
        ) : (
          <Card variant="outlined">
            <CardHeader
              avatar={<Avatar>{selectedDoctor.name.charAt(0).toUpperCase()}</Avatar>}
              title={selectedDoctor.name}
              subheader={specialtyNameById.get(selectedDoctor.specialty_id) ?? 'General'}
            />
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  {selectedDoctor.description || 'No description provided.'}
                </Typography>

                <Divider textAlign="left">
                  <Typography variant="overline">
                    Available appointments{weekLabel ? ` · ${weekLabel}` : ''}
                  </Typography>
                </Divider>

                {visibleSlots.length === 0 ? (
                  <EmptyState
                    title="No open slots"
                    message={weekLabel ? 'Nothing free in the selected week — try another week.' : 'This doctor has no available appointments right now.'}
                  />
                ) : (
                  <>
                    <Stack divider={<Divider flexItem />} spacing={1}>
                      {pagedSlots.map((slot) => {
                        const isRequested = requested.has(slot.id);
                        return (
                          <Stack
                            key={slot.id}
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Chip label={slot.dateLabel} />
                              <Chip label={slot.timeLabel} variant="outlined" />
                              {isRequested && <Chip label="Requested" color="warning" size="small" />}
                            </Stack>
                            <Checkbox
                              checked={false}
                              indeterminate={isRequested}
                              disabled={isRequested}
                              onChange={() => setPendingSlot(slot)}
                              inputProps={{ 'aria-label': `Book ${slot.dateLabel} at ${slot.timeLabel}` }}
                            />
                          </Stack>
                        );
                      })}
                    </Stack>
                    <TablePagination
                      component="div"
                      count={visibleSlots.length}
                      page={slotPage}
                      onPageChange={(_e, next) => setSlotPage(next)}
                      rowsPerPage={slotsPerPage}
                      onRowsPerPageChange={(e) => setSlotsPerPage(parseInt(e.target.value, 10))}
                      rowsPerPageOptions={SLOT_PAGE_OPTIONS}
                      labelRowsPerPage="Slots per page"
                    />
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* ---- Search + filter ---- */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField
            label="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <Button
            variant={filtersActive ? 'contained' : 'outlined'}
            disableElevation
            startIcon={<FilterListIcon />}
            onClick={openFilters}
          >
            Filters{filtersActive ? ' (on)' : ''}
          </Button>
        </Stack>

        {/* ---- Doctor table ---- */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredDoctors.length === 0 ? (
          <EmptyState
            title="No doctors match your filters"
            message="Try a different name or specialty."
          />
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Specialty</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedDoctors.map((doctor) => (
                  <TableRow key={doctor.id} hover selected={selectedDoctor?.id === doctor.id}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{specialtyNameById.get(doctor.specialty_id) ?? '—'}</TableCell>
                    <TableCell><Rating value={4.5} readOnly precision={0.5} /></TableCell>
                    <TableCell align="right">
                      <Button variant="contained" disableElevation onClick={() => handleViewDoctor(doctor)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredDoctors.length}
              page={docPage}
              onPageChange={(_e, next) => setDocPage(next)}
              rowsPerPage={docsPerPage}
              onRowsPerPageChange={(e) => setDocsPerPage(parseInt(e.target.value, 10))}
              rowsPerPageOptions={SLOT_PAGE_OPTIONS}
            />
          </TableContainer>
        )}
      </Stack>

      {/* ---- Filter dialog: week picker + specialty ---- */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)}>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <Stack spacing={2} marginTop={1}>
            <TextField
              select
              label="Specialty"
              value={draftSpecialty}
              onChange={(e) => setDraftSpecialty(e.target.value)}
              fullWidth
            >
              <MenuItem value={ALL_SPECIALTIES}>All specialties</MenuItem>
              {specialties.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>

            <Divider textAlign="left">
              <Typography variant="overline">Pick a week</Typography>
            </Divider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={draftDay}
                onChange={(value) => setDraftDay(value)}
                showDaysOutsideCurrentMonth
                displayWeekNumber
                slots={{ day: Day }}
                slotProps={{
                  day: (ownerState) => ({
                    selectedDay: draftDay,
                    hoveredDay,
                    onPointerEnter: () => setHoveredDay(ownerState.day),
                    onPointerLeave: () => setHoveredDay(null),
                  }),
                }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFiltersInDialog}>Clear</Button>
          <Button onClick={() => setFilterOpen(false)}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={applyFilters}>Apply</Button>
        </DialogActions>
      </Dialog>

      {/* ---- Booking confirm dialog ---- */}
      <Dialog open={Boolean(pendingSlot)} onClose={closeBookingDialog} fullWidth maxWidth="xs">
        <DialogTitle>Confirm appointment</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              {pendingSlot && selectedDoctor
                ? `Book ${selectedDoctor.name} on ${pendingSlot.dateLabel} at ${pendingSlot.timeLabel}?`
                : ''}
            </DialogContentText>
            <TextField
              label="Reason for visit (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBookingDialog}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={confirmBooking} disabled={booking}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </Container>
  );
}
