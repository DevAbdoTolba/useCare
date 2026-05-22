import { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Container,
  Box,
  Stack,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Chip,
  Rating,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ScarfHeart from '../components/ScarfHeart.jsx';
import AppHeader from '../components/layout/AppHeader.jsx';
import { listDoctors } from '../api/users.js';
import { listSpecialties } from '../api/specialties.js';
import { getDoctorRating } from '../lib/ratingsStore.js';
import { initialOf } from '../lib/format.js';

// Guests get a teaser, not the full directory — keeps unauthenticated traffic
// from hammering search. We show only the few best-rated doctors + the list
// of specialties; the real browser lives behind login.
const GUEST_DOCTOR_LIMIT = 3;

export default function HomePage() {
  const [topDoctors, setTopDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([listDoctors(), listSpecialties()])
      .then(([docs, specs]) => {
        if (!mounted) return;
        const specList = Array.isArray(specs) ? specs : [];
        setSpecialties(specList);
        const specName = (id) => specList.find((s) => s.id === id)?.name ?? 'General';
        const ranked = (Array.isArray(docs) ? docs : [])
          .map((d) => ({ ...d, _rating: getDoctorRating(d.id), _specialty: specName(d.specialty_id) }))
          .sort((a, b) => b._rating.average - a._rating.average)
          .slice(0, GUEST_DOCTOR_LIMIT);
        setTopDoctors(ranked);
      })
      .catch(() => { if (mounted) { setTopDoctors([]); setSpecialties([]); } });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <AppHeader />

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
                <Button size="small" component={RouterLink} to="/register">Try it</Button>
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
                <Button size="small" component={RouterLink} to="/register">For doctors</Button>
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
                <Button size="small" component={RouterLink} to="/login">How it works</Button>
              </CardActions>
            </Card>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* SECTION 2.5 — guest teaser: a few top doctors + our specialties */}
      <Box paddingY={8}>
        <Container maxWidth="md">
          <Stack spacing={1} textAlign="center" marginBottom={4}>
            <Typography variant="h4" component="h2">Meet a few of our doctors</Typography>
            <Typography variant="body1" color="text.secondary">
              A taste of the directory — sign in to browse everyone and book.
            </Typography>
          </Stack>

          {topDoctors.length > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center">
              {topDoctors.map((doc) => (
                <Card key={doc.id} variant="outlined">
                  <CardHeader
                    avatar={<Avatar>{initialOf(doc.name)}</Avatar>}
                    title={doc.name}
                    subheader={doc._specialty}
                  />
                  <CardContent>
                    <Stack spacing={1}>
                      {doc._rating.count > 0 ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating value={doc._rating.average} readOnly precision={0.5} size="small" />
                          <Typography variant="caption" color="text.secondary">({doc._rating.count})</Typography>
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.secondary">New to useCare</Typography>
                      )}
                      {doc.hourly_rate != null && (
                        <Typography variant="body2" color="text.secondary">${doc.hourly_rate} / hour</Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          {specialties.length > 0 && (
            <Stack spacing={2} marginTop={6} alignItems="center">
              <Typography variant="overline" color="text.secondary">Specialties we cover</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
                {specialties.map((s) => (
                  <Chip key={s.id} label={s.name} variant="outlined" />
                ))}
              </Stack>
            </Stack>
          )}
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

      {/* Footer */}
      <Divider />
      <Box component="footer" paddingY={4}>
        <Container maxWidth="md">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} useCare. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button size="small" color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button size="small" color="inherit" component={RouterLink} to="/register">Register</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
