import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import AppHeader from './AppHeader.jsx';

/**
 * Patient shell. TODO per wireframe:
 * - top app bar with patient name + "My appointments" + logout
 * - pick-doctor / week-picker / slots / my-appointments render in the outlet
 */
export default function PatientLayout() {
  return (
    <Box>
      <AppHeader />
      <Box padding={2}>
        <Typography variant="overline" color="text.secondary">Patient shell (TODO)</Typography>
      </Box>
      <Outlet />
    </Box>
  );
}
