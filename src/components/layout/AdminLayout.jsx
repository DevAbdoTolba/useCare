import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import AppHeader from './AppHeader.jsx';

/**
 * Admin shell. TODO per wireframe (docs/useCare.excalidraw):
 * - left sidebar with: user CRUD / specialties / appointments / system settings
 * - top app bar with admin user menu
 * - outlet renders the selected admin page
 */
export default function AdminLayout() {
  return (
    <Box>
      <AppHeader />
      <Box padding={2}>
        <Typography variant="overline" color="text.secondary">Admin shell (TODO)</Typography>
      </Box>
      <Outlet />
    </Box>
  );
}
