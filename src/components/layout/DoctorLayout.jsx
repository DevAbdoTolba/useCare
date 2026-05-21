import { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TodayIcon from '@mui/icons-material/Today';
import PersonIcon from '@mui/icons-material/Person';
import AppHeader from './AppHeader.jsx';

/**
 * Doctor shell: shared header + a slide-in nav Drawer
 * (My day / Day schedule / Profile). Pages render in the Outlet.
 */
export default function DoctorLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const today = dayjs().format('YYYY-MM-DD');

  const navItems = [
    { label: 'My day', to: '/doctor', icon: <CalendarMonthIcon />, exact: true },
    { label: 'Day schedule', to: `/doctor/day/${today}`, icon: <TodayIcon /> },
    { label: 'Profile', to: '/doctor/profile', icon: <PersonIcon /> },
  ];

  return (
    <Box>
      <AppHeader />

      <Toolbar variant="dense">
        <IconButton edge="start" onClick={() => setOpen(true)} aria-label="Open doctor menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="overline" color="text.secondary">Doctor</Typography>
      </Toolbar>
      <Divider />

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box role="presentation" onClick={() => setOpen(false)}>
          <Toolbar>
            <Typography variant="h6">useCare</Typography>
          </Toolbar>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.to}
                  selected={item.exact ? pathname === item.to : pathname.startsWith('/doctor/profile') && item.to === '/doctor/profile'}
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
