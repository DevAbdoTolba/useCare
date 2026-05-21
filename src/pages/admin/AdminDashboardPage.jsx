import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import DashboardStats from '../../components/admin/DashboardStats.jsx';
import PendingApprovalsList from '../../components/admin/PendingApprovalsList.jsx';
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
    Promise.all([listUsers(), listPendingUsers(), listAppointments(), listSpecialties()])
      .then(([users, pending, appointments, specialties]) => {
        if (!mounted) return;
        setCounts({
          users: Array.isArray(users) ? users.length : 0,
          appointments: Array.isArray(appointments) ? appointments.length : 0,
          specialties: Array.isArray(specialties) ? specialties.length : 0,
        });
        setPendingUsers(Array.isArray(pending) ? pending : []);
      })
      .catch(() => {
        if (!mounted) return;
        setCounts({ users: 0, appointments: 0, specialties: 0 });
        setPendingUsers([]);
      })
      .finally(() => { if (mounted) setLoading(false); });
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
        <DashboardStats
          counts={counts}
          pendingCount={pendingUsers.length}
          onPendingClick={() => navigate('/admin/users')}
        />
        <PendingApprovalsList users={pendingUsers} onViewAll={() => navigate('/admin/users')} />
      </Box>
    </Container>
  );
}
