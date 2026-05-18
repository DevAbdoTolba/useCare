import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

/**
 * Shared top-of-page header. Used by per-role layouts.
 * TODO: show role-aware nav links (admin vs doctor vs patient) and a
 * user menu with logout once AuthContext is wired up.
 */
export default function AppHeader() {
  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar>
        <FavoriteIcon color="primary" />
        <Typography variant="h6" component={RouterLink} to="/" marginLeft={1} flexGrow={1} color="inherit">
          useCare
        </Typography>
        <Button color="inherit" component={RouterLink} to="/login">Login</Button>
        <Button variant="contained" disableElevation component={RouterLink} to="/register">Register</Button>
      </Toolbar>
    </AppBar>
  );
}
