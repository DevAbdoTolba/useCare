import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import AppHeader from './AppHeader.jsx';

/**
 * Doctor shell. TODO per wireframe:
 * - top app bar with doctor name + logout
 * - calendar / day views render in the outlet
 */
export default function DoctorLayout() {
  return (
    <Box>
      <AppHeader />
      <Box padding={2}>
        <Typography variant="overline" color="text.secondary">Doctor shell (TODO)</Typography>
      </Box>
      <Outlet />
    </Box>
  );
}
