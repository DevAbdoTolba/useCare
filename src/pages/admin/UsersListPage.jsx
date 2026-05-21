import { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Button, ToggleButtonGroup, ToggleButton, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TablePagination, Paper, Chip } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { listUsers } from '../../api/users.js';
import { USER_STATUSES } from '../../schema/schema.js';
import ApproveUserDialog from './ApproveUserDialog.jsx';

export default function UsersListPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // UI prep state required by the task
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    listUsers()
      .then((data) => {
        if (!mounted) return;
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setError('Failed to load users');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const filteredUsers = useMemo(() => {
    if (filter === 'all') return users.slice();
    return users.filter((u) => u.status === filter);
  }, [users, filter]);

  const pagedUsers = useMemo(
    () => filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredUsers, page, rowsPerPage],
  );

  const openApproveDialog = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const closeApproveDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const refreshUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (_) {
      setError('Failed to refresh users');
    }
  };

  const handleActionUpdated = (update) => {
    // optimistic update for immediate UI feedback
    if (update && update.id) {
      setUsers((prev) => prev.map((u) => (u.id === update.id ? { ...u, ...update } : u)));
    }
    // fetch fresh list in background
    refreshUsers();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={2}>Users</Typography>

      {error ? (
        <Box>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Box>
          {/* Filter controls: All + statuses from USER_STATUSES */}
          <Box marginTop={1}>
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(_, val) => {
                // maintain 'all' when val is falsy (deselection)
                setFilter(val || 'all');
                setPage(0);
              }}
              aria-label="user status filter"
            >
              <ToggleButton value="all" aria-label="all">All</ToggleButton>
              {USER_STATUSES.map((s) => (
                <ToggleButton key={s} value={s} aria-label={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box marginTop={2}>
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="users table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedUsers.map((u) => {
                    const isPending = u.status === 'pending';
                    const chipColor = u.status === 'pending' ? 'warning' : (u.status === 'approved' ? 'success' : 'default');
                    return (
                      <TableRow key={u.id} hover={isPending} onClick={() => { if (isPending) openApproveDialog(u); }} tabIndex={isPending ? 0 : -1}>
                        <TableCell>{u.name || '—'}</TableCell>
                        <TableCell>{u.role || 'user'}</TableCell>
                        <TableCell>
                          <Chip label={u.status} color={chipColor} />
                        </TableCell>
                        <TableCell>
                          <Button disabled={!isPending} onClick={(e) => { e.stopPropagation(); if (isPending) openApproveDialog(u); }}>Open</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </TableContainer>
          </Box>

          <ApproveUserDialog open={dialogOpen} onClose={closeApproveDialog} user={selectedUser} onUpdated={handleActionUpdated} />
        </Box>
      )}
    </Container>
  );
}
