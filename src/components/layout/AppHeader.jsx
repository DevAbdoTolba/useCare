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
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth.js';

/** First letter of the user's name, for the Avatar. */
function initialOf(name) {
  return (name?.trim()?.[0] ?? '?').toUpperCase();
}

/**
 * Shared top-of-page header. Used by per-role layouts.
 * When signed in, the Login/Register buttons are replaced by an avatar
 * menu showing the user name + role and a Logout item.
 */
export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  function handleLogout() {
    setAnchorEl(null);
    logout();
    navigate('/');
  }

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar>
        <FavoriteIcon color="primary" />
        <Typography variant="h6" component={RouterLink} to="/" marginLeft={1} flexGrow={1} color="inherit">
          useCare
        </Typography>

        {user ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar>{initialOf(user.name)}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>
                <Typography variant="subtitle2">{user.name}</Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption" color="text.secondary">
                  {user.role}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
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
