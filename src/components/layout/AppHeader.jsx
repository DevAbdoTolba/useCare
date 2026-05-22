import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth.js';
import { getNavItems, HOME_BY_ROLE } from '../../lib/navConfig.jsx';

function initialOf(name) {
  return (name?.trim()?.[0] ?? '?').toUpperCase();
}

// Themed wordmark: no link underline, and a distinct look per theme — wide
// italic serif on Vintage, lowercase on Liquid Glass, bold on Classic.
const Brand = styled(Typography)(({ theme }) => {
  const family = theme.typography.fontFamily || '';
  const isVintage = /Georgia/i.test(family);
  const isGlass = /-apple-system|SF Pro/i.test(family);
  return {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 800,
    fontStyle: isVintage ? 'italic' : 'normal',
    letterSpacing: isVintage ? '0.14em' : '0.02em',
    textTransform: isGlass ? 'lowercase' : 'none',
    transition: 'opacity .15s ease',
    '&:hover': { opacity: 0.8 },
  };
});

/**
 * Shared header. When signed in, the wordmark links to the user's dashboard
 * (not the public landing), and the avatar opens a menu that mirrors the side
 * drawer's nav items plus Logout.
 */
export default function AppHeader() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const closeMenu = () => setAnchorEl(null);

  const homeTo = user ? (HOME_BY_ROLE[role] ?? '/') : '/';

  function handleLogout() {
    closeMenu();
    logout();
    navigate('/');
  }

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar>
        <Brand variant="h6" component={RouterLink} to={homeTo} flexGrow={1}>
          useCare
        </Brand>

        {user ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar>{initialOf(user.name)}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
              <MenuItem disabled>
                <Typography variant="subtitle2">{user.name}</Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption" color="text.secondary">{role}</Typography>
              </MenuItem>
              <Divider />
              {getNavItems(role).map((item) => (
                <MenuItem
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  onClick={closeMenu}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.label}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button variant="contained" disableElevation component={RouterLink} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
