import { Box } from '@mui/material';
import StatCard from '../common/StatCard.jsx';

const money = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/**
 * The dashboard stat cards. Eight metrics that wrap responsively: the four
 * counts, the money pair (total paid + the platform's 12% revenue), plus
 * approved-doctors and completed-visits health signals.
 */
export default function DashboardStats({ counts, pendingCount, onPendingClick, money: moneyStats }) {
  const cards = [
    { value: counts.users, label: 'Total users' },
    { value: pendingCount, label: 'Pending approvals', onClick: onPendingClick },
    { value: counts.appointments, label: 'Total appointments' },
    { value: counts.specialties, label: 'Specialties' },
    { value: money(moneyStats?.totalPaid), label: 'Total paid by patients' },
    { value: money(moneyStats?.revenue), label: 'Platform revenue (12%)' },
    { value: counts.approvedDoctors, label: 'Approved doctors' },
    { value: counts.completedAppointments, label: 'Completed appointments' },
  ];

  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {cards.map((c) => (
        <Box key={c.label} flexGrow={1} flexBasis={200} minWidth={180}>
          <StatCard value={c.value} label={c.label} onClick={c.onClick} />
        </Box>
      ))}
    </Box>
  );
}
