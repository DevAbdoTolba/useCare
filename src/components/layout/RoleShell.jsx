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
import AppHeader from './AppHeader.jsx';
import { getNavItems, isNavActive } from '../../lib/navConfig.jsx';

/**
 * One shell for every role: shared header + a slide-in nav Drawer built from
 * the shared nav config (so the drawer always matches the header menu). The
 * temporary drawer overlays the content, so there's no empty sidebar gap and
 * the content stays centered. `isNavActive` makes sure only one item lights up.
 */
export default function RoleShell({ role, label }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const items = getNavItems(role);

  return (
    <Box>
      <AppHeader />

      <Toolbar variant="dense">
        <IconButton edge="start" onClick={() => setOpen(true)} aria-label={`Open ${label} menu`}>
          <MenuIcon />
        </IconButton>
        <Typography variant="overline" color="text.secondary">{label}</Typography>
      </Toolbar>
      <Divider />

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box role="presentation" onClick={() => setOpen(false)}>
          <Toolbar>
            <Typography variant="h6">useCare</Typography>
          </Toolbar>
          <Divider />
          <List>
            {items.map((item) => (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.to}
                  selected={isNavActive(pathname, item.to)}
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
