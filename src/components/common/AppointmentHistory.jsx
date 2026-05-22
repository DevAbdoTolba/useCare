import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Stack,
  Box,
  Typography,
  Chip,
  Divider,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmptyState from './EmptyState.jsx';
import { timeLabel, STATUS_COLOR } from '../../lib/format.js';
import { APPOINTMENT_STATUSES } from '../../schema/schema.js';

const ALL = 'all';
const FILTERS = [ALL, ...APPOINTMENT_STATUSES];
const PAGE_INITIAL = 10; // appointments shown per month before "load more"
const PAGE_STEP = 5;      // how many more each click reveals
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Shared appointment history — used by BOTH the patient and the doctor views.
 *
 * Free-text search (matches the counterpart's name, the date in any form, the
 * time, status and notes), status chips, then full-width accordions grouped by
 * month. Each month starts capped at 10 newest-first; "Load 5 more" reveals the
 * rest a chunk at a time so you never have to scroll a giant list — and the
 * search jumps you straight to a known date.
 *
 * @param {object[]} appointments
 * @param {(a: object) => string} getPersonName  the counterpart's name (doctor for a patient, patient for a doctor)
 * @param {string} personLabel                   what the counterpart is called ("Doctor" / "Patient")
 */
export default function AppointmentHistory({
  appointments,
  getPersonName,
  personLabel = 'Person',
  notesLabel = 'Notes',
  renderActions,
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(ALL);
  const [limitByMonth, setLimitByMonth] = useState({});

  const enriched = useMemo(
    () => appointments.map((a) => {
      const person = getPersonName(a) || '';
      const haystack = [
        person,
        a.date,
        dayjs(a.date).format('MMMM D YYYY dddd'),
        timeLabel(a.time),
        a.status,
        a.notes || '',
      ].join(' ').toLowerCase();
      return { ...a, _person: person, _haystack: haystack };
    }),
    [appointments, getPersonName],
  );

  const term = search.trim().toLowerCase();
  const searched = useMemo(
    () => enriched.filter((a) => !term || term.split(/\s+/).every((t) => a._haystack.includes(t))),
    [enriched, term],
  );

  // Chip counts reflect the current text search, then the chip narrows further.
  const counts = useMemo(() => {
    const m = { [ALL]: searched.length };
    APPOINTMENT_STATUSES.forEach((s) => { m[s] = searched.filter((a) => a.status === s).length; });
    return m;
  }, [searched]);

  const groups = useMemo(() => {
    const visible = searched
      .filter((a) => filter === ALL || a.status === filter)
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
    const byMonth = new Map();
    visible.forEach((a) => {
      const key = dayjs(a.date).format('MMMM YYYY');
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key).push(a);
    });
    return [...byMonth.entries()];
  }, [searched, filter]);

  // A changed result set resets every month back to its first page.
  useEffect(() => { setLimitByMonth({}); }, [term, filter]);

  const limitFor = (month) => limitByMonth[month] ?? PAGE_INITIAL;
  const loadMore = (month) => setLimitByMonth((m) => ({ ...m, [month]: limitFor(month) + PAGE_STEP }));

  return (
    <Stack spacing={3}>
      <TextField
        label={`Search by ${personLabel.toLowerCase()}, date, status or notes…`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />

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
        <EmptyState title="Nothing here" message="No appointments match your search." />
      ) : (
        <Stack spacing={3}>
          {groups.map(([month, appts]) => {
            const limit = limitFor(month);
            const shown = appts.slice(0, limit);
            const remaining = appts.length - shown.length;
            return (
              <Box key={month}>
                <Divider textAlign="left">
                  <Typography variant="overline" color="text.secondary">{month} · {appts.length}</Typography>
                </Divider>
                <Stack spacing={1} marginTop={1}>
                  {shown.map((a) => (
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
                            <Typography variant="body2">· {a._person}</Typography>
                          </Stack>
                          <Chip size="small" label={cap(a.status)} color={STATUS_COLOR[a.status] ?? 'default'} />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          <Typography variant="overline" color="text.secondary">{notesLabel}</Typography>
                          <Typography variant="body2" color={a.notes?.trim() ? 'text.primary' : 'text.secondary'}>
                            {a.notes?.trim() ? a.notes : 'No notes.'}
                          </Typography>
                          {renderActions && (
                            <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                              {renderActions(a)}
                            </Stack>
                          )}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  {remaining > 0 && (
                    <Box>
                      <Button onClick={() => loadMore(month)}>
                        Load {Math.min(PAGE_STEP, remaining)} more ({remaining} left)
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
