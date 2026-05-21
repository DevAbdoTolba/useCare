import { Stack } from '@mui/material';
import StatCard from '../common/StatCard.jsx';

/** The row of dashboard stat cards. */
export default function DashboardStats({ counts, pendingCount, onPendingClick }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <StatCard value={counts.users} label="Total users" />
      <StatCard value={pendingCount} label="Pending approvals" onClick={onPendingClick} />
      <StatCard value={counts.appointments} label="Total appointments" />
      <StatCard value={counts.specialties} label="Specialties" />
    </Stack>
  );
}
