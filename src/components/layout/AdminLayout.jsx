import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import AppHeader from './AppHeader.jsx';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Users', icon: <GroupIcon />, path: '/admin/users' },
  { text: 'Specialties', icon: <MedicalServicesIcon />, path: '/admin/specialties' },
  { text: 'Appointments', icon: <EventIcon />, path: '/admin/appointments' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawerContent = (
    <React.Fragment>
      <Toolbar />
      <Box paddingX={1}>
        <Typography variant="subtitle2" color="text.secondary">Admin</Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => {
          const selected = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <ListItemButton key={item.path} selected={selected} onClick={() => handleNav(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <AppHeader />

      {/* Main grid: sidebar (desktop) + content */}
      <Grid container>
        {isDesktop && (
          <Grid item md={3}>
            <nav aria-label="admin navigation">
              <Drawer variant="permanent" open>
                {drawerContent}
              </Drawer>
            </nav>
          </Grid>
        )}

        <Grid item xs={12} md={isDesktop ? 9 : 12}>
          {/* mobile toggle shown above content area */}
          {!isDesktop && (
            <Box padding={1}>
              <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          <Toolbar />
          <Box padding={2}>
            <Typography variant="overline" color="text.secondary">Admin shell</Typography>
          </Box>
          <Outlet />
        </Grid>
      </Grid>

      {/* Temporary drawer for mobile */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      )}
    </React.Fragment>
  );
}
