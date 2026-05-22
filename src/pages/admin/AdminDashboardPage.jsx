import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import DashboardStats from '../../components/admin/DashboardStats.jsx';
import PendingApprovalsList from '../../components/admin/PendingApprovalsList.jsx';
import { listUsers, listPendingUsers } from '../../api/users.js';
import { listAppointments } from '../../api/appointments.js';
import { listSpecialties } from '../../api/specialties.js';
import { getTotalPaid, PLATFORM_FEE_RATE } from '../../api/payments.js';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    users: 0, appointments: 0, specialties: 0, approvedDoctors: 0, completedAppointments: 0,
  });
  const [money, setMoney] = useState({ totalPaid: 0, revenue: 0 });
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([listUsers(), listPendingUsers(), listAppointments(), listSpecialties(), getTotalPaid()])
      .then(([users, pending, appointments, specialties, totalPaid]) => {
        if (!mounted) return;
        const userList = Array.isArray(users) ? users : [];
        const apptList = Array.isArray(appointments) ? appointments : [];
        setCounts({
          users: userList.length,
          appointments: apptList.length,
          specialties: Array.isArray(specialties) ? specialties.length : 0,
          approvedDoctors: userList.filter((u) => u.role === 'doctor' && u.status === 'approved').length,
          completedAppointments: apptList.filter((a) => a.status === 'completed').length,
        });
        setMoney({ totalPaid, revenue: totalPaid * PLATFORM_FEE_RATE });
        setPendingUsers(Array.isArray(pending) ? pending : []);
      })
      .catch(() => {
        if (!mounted) return;
        setCounts({ users: 0, appointments: 0, specialties: 0, approvedDoctors: 0, completedAppointments: 0 });
        setMoney({ totalPaid: 0, revenue: 0 });
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
          money={money}
          pendingCount={pendingUsers.length}
          onPendingClick={() => navigate('/admin/users?status=pending')}
        />
        <PendingApprovalsList users={pendingUsers} onViewAll={() => navigate('/admin/users?status=pending')} />
      </Box>
    </Container>
  );
}
