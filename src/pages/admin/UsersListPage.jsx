import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Stack,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { listUsers, approveUser, rejectUser } from '../../api/users.js';
import { listSpecialties } from '../../api/specialties.js';
import { USER_STATUSES } from '../../schema/schema.js';
import MasterDetailBrowser from '../../components/common/MasterDetailBrowser.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { initialOf } from '../../lib/format.js';

const STATUS_CHIP = { pending: 'warning', approved: 'success', rejected: 'default' };
const ALL = 'all';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const initialStatus = USER_STATUSES.includes(searchParams.get('status'))
    ? searchParams.get('status')
    : ALL;
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let mounted = true;
    Promise.all([listUsers(), listSpecialties()])
      .then(([u, s]) => {
        if (!mounted) return;
        setUsers(Array.isArray(u) ? u : []);
        setSpecialties(Array.isArray(s) ? s : []);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const specialtyName = (id) => specialties.find((s) => s.id === id)?.name ?? '—';

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesName = !term || u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
      const matchesStatus = statusFilter === ALL || u.status === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const selected = users.find((u) => u.id === selectedId) ?? null;

  function applyStatus(id, status, label) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setToast(label);
  }
  async function handleApprove(id) {
    await approveUser(id);
    applyStatus(id, 'approved', 'User approved.');
  }
  async function handleReject(id) {
    await rejectUser(id);
    applyStatus(id, 'rejected', 'User rejected.');
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (u) => <Chip size="small" label={u.status} color={STATUS_CHIP[u.status] ?? 'default'} />,
    },
  ];

  const renderDetail = (u) => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar>{initialOf(u.name)}</Avatar>
        <Box>
          <Typography variant="h6">{u.name}</Typography>
          <Typography variant="body2" color="text.secondary">{u.email}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={u.role} variant="outlined" />
        <Chip label={u.status} color={STATUS_CHIP[u.status] ?? 'default'} />
        {u.role === 'doctor' && <Chip label={specialtyName(u.specialty_id)} variant="outlined" />}
      </Stack>
      <Divider />
      <Row label="Phone" value={u.phone_number} />
      <Row label="Gender" value={u.gender} />
      <Row label="Date of birth" value={u.date_of_birth} />
      {u.role === 'doctor' && <Row label="About" value={u.description} />}

      {u.status === 'pending' && (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button color="warning" onClick={() => handleReject(u.id)}>Reject</Button>
          <Button variant="contained" disableElevation onClick={() => handleApprove(u.id)}>Approve</Button>
        </Stack>
      )}
    </Stack>
  );

  return (
    <>
      <MasterDetailBrowser
        title="Users"
        placeholderTitle="No user selected"
        placeholderMessage="Pick a user from the table below to see their details."
        selected={selected}
        selectedId={selectedId}
        onSelectRow={(u) => setSelectedId(u ? u.id : null)}
        renderDetail={renderDetail}
        columns={columns}
        rows={rows}
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="Search by name or email"
        emptyMessage="No users match your filters"
        filters={(
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value={ALL}>All</MenuItem>
            {USER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
            ))}
          </TextField>
        )}
      />
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value || '—'}</Typography>
    </Stack>
  );
}
