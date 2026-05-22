import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Container,
  Stack,
  Box,
  Typography,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { listAppointmentsForPatient } from '../../api/appointments.js';
import { getUser } from '../../api/users.js';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { timeLabel, STATUS_COLOR } from '../../lib/format.js';
import { APPOINTMENT_STATUSES } from '../../schema/schema.js';

const ALL = 'all';
const FILTERS = [ALL, ...APPOINTMENT_STATUSES];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * A flat history of every appointment the patient ever had: simple status
 * chips at the top, then full-width accordion rows grouped by month with a
 * thin rule between months. Pure MUI — no calendar, no grid.
 */
export default function AppointmentHistoryPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctorById, setDoctorById] = useState({});
  const [filter, setFilter] = useState(ALL);

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

  const doctorName = (id) => doctorById[id]?.name ?? `Doctor #${id}`;

  // Newest first, filtered by status, then grouped by "Month YYYY".
  const groups = useMemo(() => {
    const visible = appointments
      .filter((a) => filter === ALL || a.status === filter)
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

    const byMonth = new Map();
    visible.forEach((a) => {
      const key = dayjs(a.date).format('MMMM YYYY');
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key).push(a);
    });
    return [...byMonth.entries()];
  }, [appointments, filter]);

  const counts = useMemo(() => {
    const m = { [ALL]: appointments.length };
    APPOINTMENT_STATUSES.forEach((s) => { m[s] = appointments.filter((a) => a.status === s).length; });
    return m;
  }, [appointments]);

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

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {FILTERS.map((f) => (
            <Chip
              key={f}
              label={`${f === ALL ? 'All' : cap(f)} (${counts[f] ?? 0})`}
              color={filter === f ? 'primary' : 'default'}
              variant={filter === f ? 'filled' : 'outlined'}
              onClick={() => setFilter(f)}
            />
          ))}
        </Stack>

        {groups.length === 0 ? (
          <EmptyState
            title="Nothing here"
            message="No appointments match this filter."
          />
        ) : (
          <Stack spacing={3}>
            {groups.map(([month, appts]) => (
              <Box key={month}>
                <Divider textAlign="left">
                  <Typography variant="overline" color="text.secondary">{month}</Typography>
                </Divider>
                <Stack spacing={1} marginTop={1}>
                  {appts.map((a) => (
                    <Accordion key={a.id} variant="outlined" disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          justifyContent="space-between"
                          flexGrow={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Typography variant="subtitle2">{dayjs(a.date).format('ddd, MMM D')}</Typography>
                            <Typography variant="body2" color="text.secondary">{timeLabel(a.time)}</Typography>
                            <Typography variant="body2">· {doctorName(a.doctor_id)}</Typography>
                          </Stack>
                          <Chip size="small" label={cap(a.status)} color={STATUS_COLOR[a.status] ?? 'default'} />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          <Typography variant="overline" color="text.secondary">Doctor&apos;s notes</Typography>
                          <Typography variant="body2" color={a.notes?.trim() ? 'text.primary' : 'text.secondary'}>
                            {a.notes?.trim() ? a.notes : 'No notes from the doctor.'}
                          </Typography>
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
