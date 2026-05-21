import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ScarfHeart from '../components/ScarfHeart.jsx';

export default function HomePage() {
  return (
    <>
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" flexGrow={1}>
            useCare
          </Typography>
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          <Button variant="contained" disableElevation component={RouterLink} to="/register">Register</Button>
        </Toolbar>
      </AppBar>

      {/* SECTION 1 — HERO (full viewport) */}
      <Box minHeight="100vh" display="flex" alignItems="center">
        <Container maxWidth="md">
          <Box textAlign="center">
          <Typography variant="overline" color="primary" gutterBottom>
            Appointments that just work
          </Typography>
          <Typography variant="h2" component="h1" gutterBottom>
            Care, on your calendar.
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Book doctors, manage visits, and keep your health in one place.
            Built for patients, doctors, and clinics — together.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" marginTop={4}>
            <Button variant="contained" size="large" disableElevation component={RouterLink} to="/register">
              Get started
            </Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/login">
              Learn more
            </Button>
          </Stack>
          </Box>
        </Container>
      </Box>

      <Divider />

      {/* SECTION 2 — full viewport so the scroll animation triggers AFTER scrolling */}
      <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" paddingY={8}>
        <ScarfHeart>
          <Typography variant="h3" component="h2" gutterBottom>
            Why useCare?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Three reasons people stay.
          </Typography>
        </ScarfHeart>

        <Container maxWidth="md">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            marginTop={6}
            justifyContent="center"
          >
            <Card variant="outlined">
              <CardContent>
                <CalendarMonthIcon color="primary" fontSize="large" />
                <Typography variant="h6" gutterBottom marginTop={1}>
                  One-tap booking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pick a doctor, pick a slot, you're done. No phone calls.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Try it</Button>
              </CardActions>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <MedicalServicesIcon color="primary" fontSize="large" />
                <Typography variant="h6" gutterBottom marginTop={1}>
                  Doctors in control
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Doctors set their own availability and notes per visit.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">For doctors</Button>
              </CardActions>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <VerifiedUserIcon color="primary" fontSize="large" />
                <Typography variant="h6" gutterBottom marginTop={1}>
                  Admin-approved
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Every doctor on useCare is vetted before they appear.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">How it works</Button>
              </CardActions>
            </Card>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* SECTION 3 — placeholder so section 2 can actually be scrolled INTO */}
      <Container maxWidth="md">
        <Box paddingY={10} textAlign="center">
          <Typography variant="h5" gutterBottom>
            Ready when you are.
          </Typography>
          <Button variant="contained" size="large" disableElevation component={RouterLink} to="/register">
            Create your account
          </Button>
        </Box>
      </Container>
    </>
  );
}
