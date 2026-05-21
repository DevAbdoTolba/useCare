import { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AppHeader from './AppHeader.jsx';

const NAV_ITEMS = [
  { label: 'Find a doctor', to: '/patient', icon: <PersonSearchIcon /> },
  { label: 'My appointments', to: '/patient/appointments', icon: <EventNoteIcon /> },
];

/**
 * Patient shell: shared header + a slide-in navigation Drawer
 * (Find a doctor / My appointments). Pages render in the Outlet.
 */
export default function PatientLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <AppHeader />

      <Toolbar variant="dense">
        <IconButton edge="start" onClick={() => setOpen(true)} aria-label="Open patient menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="overline" color="text.secondary">Patient</Typography>
      </Toolbar>
      <Divider />

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box role="presentation" onClick={() => setOpen(false)}>
          <Toolbar>
            <Typography variant="h6">useCare</Typography>
          </Toolbar>
          <Divider />
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.to}
                  selected={pathname === item.to}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Outlet />
    </Box>
  );
}
