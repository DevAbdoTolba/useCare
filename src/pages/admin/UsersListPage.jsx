import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Stack,
  Box,
  Typography,
  Avatar,
  Chip,
  Rating,
  Button,
  TextField,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  listUsers,
  getUser,
  approveUser,
  rejectUser,
  banUser,
  unbanUser,
} from '../../api/users.js';
import { listPendingRequests } from '../../lib/docUpdateRequestsStore.js';
import MasterDetailBrowser from '../../components/common/MasterDetailBrowser.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { initialOf, USER_STATUS_COLOR } from '../../lib/format.js';

const ALL = 'all';
const STATUSES = ['pending', 'approved', 'rejected', 'banned'];
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const money = (n) => `$${Number(n || 0).toLocaleString()}`;

// A patient is always "approved", so that chip is just noise — only show a
// status chip when it carries information (any doctor, or a banned/rejected one).
const showStatus = (u) => u.role !== 'patient' || u.status !== 'approved';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const initialStatus = STATUSES.includes(searchParams.get('status'))
    ? searchParams.get('status')
    : ALL;
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null); // enriched (doctor docs + rating + stats)
  const [detailLoading, setDetailLoading] = useState(false);
  const [toast, setToast] = useState('');
  // Doctors with a pending resume/license update request (admin notification).
  const [pendingDocIds, setPendingDocIds] = useState(() => new Set());
  const [pendingDocsOnly, setPendingDocsOnly] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([listUsers(), listPendingRequests().catch(() => [])])
      .then(([u, reqs]) => {
        if (!mounted) return;
        setUsers(Array.isArray(u) ? u : []);
        setPendingDocIds(new Set((reqs ?? []).map((r) => r.doctor_id)));
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // Pull the full record (resume/license/rating/stats) whenever a row is picked.
  useEffect(() => {
    if (selectedId == null) { setDetail(null); return; }
    let mounted = true;
    setDetailLoading(true);
    getUser(selectedId)
      .then((d) => { if (mounted) setDetail(d); })
      .catch(() => { if (mounted) setDetail(null); })
      .finally(() => { if (mounted) setDetailLoading(false); });
    return () => { mounted = false; };
  }, [selectedId]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesName =
        !term || u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
      const matchesStatus = statusFilter === ALL || u.status === statusFilter;
      const matchesDocs = !pendingDocsOnly || pendingDocIds.has(u.id);
      return matchesName && matchesStatus && matchesDocs;
    });
  }, [users, search, statusFilter, pendingDocsOnly, pendingDocIds]);

  const selected = users.find((u) => u.id === selectedId) ?? null;

  function patch(id, changes, label) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...changes } : u)));
    setDetail((d) => (d && d.id === id ? { ...d, ...changes } : d));
    setToast(label);
  }
  const handleApprove = async (id) => { await approveUser(id); patch(id, { status: 'approved' }, 'Doctor approved.'); };
  const handleReject = async (id) => { await rejectUser(id); patch(id, { status: 'rejected' }, 'Doctor rejected.'); };
  const handleBan = async (id) => { await banUser(id); patch(id, { status: 'banned' }, 'User banned.'); };
  const handleUnban = async (id) => { await unbanUser(id); patch(id, { status: 'approved' }, 'User reinstated.'); };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role', render: (u) => cap(u.role) },
    {
      key: 'status',
      label: 'Status',
      render: (u) =>
        showStatus(u) ? (
          <Chip size="small" label={cap(u.status)} color={USER_STATUS_COLOR[u.status] ?? 'default'} />
        ) : null,
    },
  ];

  const actionsFor = (u) => {
    if (u.role === 'admin') return null;
    if (u.role === 'doctor' && u.status === 'pending') {
      return (
        <>
          <Button color="warning" onClick={() => handleReject(u.id)}>Reject</Button>
          <Button variant="contained" disableElevation onClick={() => handleApprove(u.id)}>Approve</Button>
        </>
      );
    }
    if (u.status === 'banned') {
      return <Button variant="contained" disableElevation onClick={() => handleUnban(u.id)}>Unban</Button>;
    }
    return <Button color="error" onClick={() => handleBan(u.id)}>Ban</Button>;
  };

  const renderDetail = (row) => {
    const u = detail && detail.id === row.id ? detail : row;
    const isDoctor = u.role === 'doctor';
    const rating = u.rating ?? { average: 0, count: 0 };
    const stats = u.stats ?? {};
    return (
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>{initialOf(u.name)}</Avatar>
          <Box>
            <Typography variant="h6">{u.name}</Typography>
            <Typography variant="body2" color="text.secondary">{u.email}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label={cap(u.role)} variant="outlined" />
          {showStatus(u) && (
            <Chip label={cap(u.status)} color={USER_STATUS_COLOR[u.status] ?? 'default'} />
          )}
          {isDoctor && u.specialty && <Chip label={u.specialty} variant="outlined" />}
        </Stack>

        <Divider />

        {isDoctor ? (
          <>
            <Stack direction="row" spacing={1} alignItems="center">
              {rating.count > 0 ? (
                <>
                  <Rating value={rating.average} readOnly precision={0.5} size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {rating.average} ({rating.count} review{rating.count === 1 ? '' : 's'})
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">No ratings yet</Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip variant="outlined" label={`${stats.appointments ?? 0} appointments`} />
              <Chip variant="outlined" label={`${stats.completed ?? 0} completed`} />
              <Chip variant="outlined" label={`Earned ${money(stats.total_earned)}`} />
              {u.hourly_rate != null && <Chip color="primary" variant="outlined" label={`$${u.hourly_rate}/hr`} />}
            </Stack>

            <Box>
              <Typography variant="overline" color="text.secondary">Verification documents</Typography>
              {detailLoading ? (
                <Typography variant="body2" color="text.secondary">Loading documents…</Typography>
              ) : (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} marginTop={1}>
                  <Button
                    startIcon={<DescriptionIcon />}
                    variant="outlined"
                    component="a"
                    href={u.resume_url || undefined}
                    target="_blank"
                    rel="noopener"
                    disabled={!u.resume_url}
                  >
                    {u.resume_url ? 'Open resume' : 'No resume'}
                  </Button>
                  <Button
                    startIcon={<VerifiedUserIcon />}
                    variant="outlined"
                    component="a"
                    href={u.license_url || undefined}
                    target="_blank"
                    rel="noopener"
                    disabled={!u.license_url}
                  >
                    {u.license_url ? 'Open license' : 'No license'}
                  </Button>
                </Stack>
              )}
            </Box>

            <Row label="About" value={u.description} />
          </>
        ) : (
          <>
            <Row label="Phone" value={u.phone_number} />
            <Row label="Gender" value={cap(u.gender)} />
            <Row label="Date of birth" value={u.date_of_birth} />
          </>
        )}

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {actionsFor(u)}
        </Stack>
      </Stack>
    );
  };

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
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value={ALL}>All</MenuItem>
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{cap(s)}</MenuItem>
              ))}
            </TextField>
            {/* Notification + filter: doctors with a pending resume/license request. */}
            <Chip
              icon={<DescriptionIcon />}
              label={`Pending docs${pendingDocIds.size ? ` (${pendingDocIds.size})` : ''}`}
              color="warning"
              variant={pendingDocsOnly ? 'filled' : 'outlined'}
              onClick={() => setPendingDocsOnly((v) => !v)}
            />
          </Stack>
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
