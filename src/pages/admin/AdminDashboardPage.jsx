import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, CardActionArea, Stack, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Divider } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { listUsers, listPendingUsers } from '../../api/users.js';
import { listAppointments } from '../../api/appointments.js';
import { listSpecialties } from '../../api/specialties.js';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ users: 0, appointments: 0, specialties: 0 });
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      listUsers(),
      listPendingUsers(),
      listAppointments(),
      listSpecialties(),
    ])
      .then(([users, pending, appointments, specialties]) => {
        if (!mounted) return;
        setCounts({
          users: Array.isArray(users) ? users.length : 0,
          appointments: Array.isArray(appointments) ? appointments.length : 0,
          specialties: Array.isArray(specialties) ? specialties.length : 0,
        });
        setPendingUsers(Array.isArray(pending) ? pending : []);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[AdminDashboardPage] data fetch failed', err);
        if (mounted) {
          setCounts({ users: 0, appointments: 0, specialties: 0 });
          setPendingUsers([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Admin Dashboard</Typography>
      <Box marginTop={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5">{counts.users}</Typography>
              <Typography color="text.secondary">Total users</Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardActionArea onClick={() => navigate('/admin/users')}>
              <CardContent>
                <Typography variant="h5">{pendingUsers.length}</Typography>
                <Typography color="text.secondary">Pending approvals</Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5">{counts.appointments}</Typography>
              <Typography color="text.secondary">Total appointments</Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5">{counts.specialties}</Typography>
              <Typography color="text.secondary">Specialties</Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Recent pending approvals */}
        <Box marginTop={2}>
          <Typography variant="h6" gutterBottom>Recent pending approvals</Typography>
          {pendingUsers.length === 0 ? (
            <EmptyState title="No pending approvals" />
          ) : (
            <>
              <List>
                {pendingUsers.slice(0, 5).map((u) => (
                  <ListItem key={u.id} disablePadding>
                    <ListItemAvatar>
                      <Avatar>{(u.first_name || u.name || '?')[0] || '?'}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={(u.name ?? `${u.first_name || ''} ${u.last_name || ''}`.trim()) || u.email || ('User ' + u.id)}
                      secondary={u.email ? `${u.email} · ${u.role || ''}`.trim() : (u.role || '')}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider />
              <Box marginTop={1}>
                <Button variant="outlined" onClick={() => navigate('/admin/users')}>View all pending users</Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
