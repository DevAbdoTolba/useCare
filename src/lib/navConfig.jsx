import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';

/** Where each role lands as its "home". */
export const HOME_BY_ROLE = { admin: '/admin', doctor: '/doctor', patient: '/patient' };

/**
 * Single source of truth for per-role navigation. Used by BOTH the side
 * drawers and the header avatar menu so they always match.
 */
export function getNavItems(role) {
  switch (role) {
    case 'patient':
      return [
        { label: 'Find a doctor', to: '/patient', icon: <PersonSearchIcon /> },
        { label: 'My appointments', to: '/patient/appointments', icon: <EventNoteIcon /> },
        { label: 'My profile', to: '/patient/profile', icon: <PersonIcon /> },
      ];
    case 'doctor':
      return [
        { label: 'My day', to: '/doctor', icon: <CalendarMonthIcon /> },
        { label: 'My profile', to: '/doctor/profile', icon: <PersonIcon /> },
      ];
    case 'admin':
      return [
        { label: 'Dashboard', to: '/admin', icon: <DashboardIcon /> },
        { label: 'Users', to: '/admin/users', icon: <GroupIcon /> },
        { label: 'Specialties', to: '/admin/specialties', icon: <MedicalServicesIcon /> },
        { label: 'Appointments', to: '/admin/appointments', icon: <EventIcon /> },
        { label: 'Settings', to: '/admin/settings', icon: <SettingsIcon /> },
        { label: 'My profile', to: '/admin/profile', icon: <PersonIcon /> },
      ];
    default:
      return [];
  }
}

/** Active-route test that doesn't light up the index route for every child. */
export function isNavActive(pathname, to) {
  if (to === '/admin' || to === '/doctor' || to === '/patient') return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}
