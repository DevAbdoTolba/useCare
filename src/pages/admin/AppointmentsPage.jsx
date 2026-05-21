import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Stack,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { listAppointments } from '../../api/appointments.js';
import { listUsers } from '../../api/users.js';
import { listSpecialties } from '../../api/specialties.js';
import { APPOINTMENT_STATUSES } from '../../schema/schema.js';
import MasterDetailBrowser from '../../components/common/MasterDetailBrowser.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { initialOf, timeLabel, ageFromDob, STATUS_COLOR } from '../../lib/format.js';
import { exportAppointmentsPdf } from '../../lib/exportAppointmentsPdf.js';

const ALL = 'all';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [userById, setUserById] = useState({});
  const [specialtyById, setSpecialtyById] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([listAppointments(), listUsers(), listSpecialties()])
      .then(([appts, users, specs]) => {
        if (!mounted) return;
        setAppointments(Array.isArray(appts) ? appts : []);
        const u = {};
        (users ?? []).forEach((x) => { u[x.id] = x; });
        setUserById(u);
        const s = {};
        (specs ?? []).forEach((x) => { s[x.id] = x; });
        setSpecialtyById(s);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const nameOf = (id) => userById[id]?.name ?? `#${id}`;
  const specialtyOf = (doctorId) => specialtyById[userById[doctorId]?.specialty_id]?.name ?? '—';

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return appointments.filter((a) => {
      const matchesName = !term
        || nameOf(a.patient_id).toLowerCase().includes(term)
        || nameOf(a.doctor_id).toLowerCase().includes(term);
      const matchesStatus = statusFilter === ALL || a.status === statusFilter;
      return matchesName && matchesStatus;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments, search, statusFilter, userById]);

  const selected = appointments.find((a) => a.id === selectedId) ?? null;

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time', render: (a) => timeLabel(a.time) },
    { key: 'patient', label: 'Patient', render: (a) => nameOf(a.patient_id) },
    { key: 'doctor', label: 'Doctor', render: (a) => nameOf(a.doctor_id) },
    { key: 'status', label: 'Status', render: (a) => <Chip size="small" label={a.status} color={STATUS_COLOR[a.status] ?? 'default'} /> },
  ];

  const renderDetail = (a) => {
    const patient = userById[a.patient_id];
    const doctor = userById[a.doctor_id];
    const age = ageFromDob(patient?.date_of_birth);
    return (
      <Stack spacing={2}>
        {/* Section 1: Patient | Doctor */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box flexGrow={1}>
            <Typography variant="overline" color="text.secondary">Patient</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>{initialOf(patient?.name ?? '?')}</Avatar>
              <Box>
                <Typography variant="subtitle1">{patient?.name ?? `#${a.patient_id}`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {[patient?.phone_number, age != null ? `${age} yrs` : null].filter(Boolean).join(' · ')}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box flexGrow={1}>
            <Typography variant="overline" color="text.secondary">Doctor</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>{initialOf(doctor?.name ?? '?')}</Avatar>
              <Box>
                <Typography variant="subtitle1">{doctor?.name ?? `#${a.doctor_id}`}</Typography>
                <Typography variant="body2" color="text.secondary">{specialtyOf(a.doctor_id)}</Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>

        <Divider />

        {/* Section 2: appointment info + doctor's note */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label={a.date} />
          <Chip label={timeLabel(a.time)} variant="outlined" />
          <Chip label={a.status} color={STATUS_COLOR[a.status] ?? 'default'} />
        </Stack>
        <Box>
          <Typography variant="overline" color="text.secondary">Doctor&apos;s note</Typography>
          <Typography variant="body2" color={a.notes?.trim() ? 'text.primary' : 'text.secondary'}>
            {a.notes?.trim() ? a.notes : 'No note recorded.'}
          </Typography>
        </Box>
      </Stack>
    );
  };

  return (
    <MasterDetailBrowser
      title="Appointments"
      placeholderTitle="No appointment selected"
      placeholderMessage="Pick an appointment from the table below to see its full details."
      selected={selected}
      selectedId={selectedId}
      onSelectRow={(a) => setSelectedId(a ? a.id : null)}
      renderDetail={renderDetail}
      columns={columns}
      rows={rows}
      searchValue={search}
      onSearchChange={setSearch}
      searchLabel="Search by patient or doctor"
      emptyMessage="No appointments match your filters"
      actions={(
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => exportAppointmentsPdf(rows, nameOf)}
          disabled={rows.length === 0}
        >
          Export PDF
        </Button>
      )}
      filters={(
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value={ALL}>All</MenuItem>
          {APPOINTMENT_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
