import { useEffect, useMemo, useState } from 'react';
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
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ScarfHeart from '../components/ScarfHeart.jsx';
import AppHeader from '../components/layout/AppHeader.jsx';
import { listDoctors } from '../api/users.js';
import { listSpecialties } from '../api/specialties.js';
import { getDoctorRating } from '../lib/ratingsStore.js';
import { initialOf } from '../lib/format.js';

// Guests get a teaser, not the full directory. By default we show the few
// best-rated doctors; a guest may run a couple of searches (by name or
// specialty), and after that — or to actually view/book anyone — we ask them
// to sign in. Keeps unauthenticated traffic from hammering search.
const GUEST_TOP_LIMIT = 3;
const MAX_GUEST_SEARCHES = 2;
const ALL = 'all';

export default function HomePage() {
  const navigate = useNavigate();
  const [allDoctors, setAllDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const [query, setQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState(ALL);
  const [applied, setApplied] = useState(null); // committed search, or null = default view
  const [searchCount, setSearchCount] = useState(0);
  const [loginGate, setLoginGate] = useState(false);

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
          .sort((a, b) => b._rating.average - a._rating.average);
        setAllDoctors(ranked);
      })
      .catch(() => { if (mounted) { setAllDoctors([]); setSpecialties([]); } });
    return () => { mounted = false; };
  }, []);

  const topDoctors = useMemo(() => allDoctors.slice(0, GUEST_TOP_LIMIT), [allDoctors]);

  const results = useMemo(() => {
    if (!applied) return topDoctors;
    const term = applied.query.trim().toLowerCase();
    return allDoctors.filter(
      (d) =>
        (!term || d.name.toLowerCase().includes(term)) &&
        (applied.specialty === ALL || d.specialty_id === applied.specialty),
    );
  }, [applied, allDoctors, topDoctors]);

  const searchesLeft = MAX_GUEST_SEARCHES - searchCount;

  function handleSearch() {
    if (searchCount >= MAX_GUEST_SEARCHES) { setLoginGate(true); return; }
    setSearchCount((c) => c + 1);
    setApplied({ query, specialty: specialtyFilter });
  }

  // Clicking a specialty chip is also a search (and counts toward the limit).
  function searchBySpecialty(id) {
    if (searchCount >= MAX_GUEST_SEARCHES) { setLoginGate(true); return; }
    setSearchCount((c) => c + 1);
    setQuery('');
    setSpecialtyFilter(id);
    setApplied({ query: '', specialty: id });
  }

  // A guest can't actually view a profile or book — that needs an account.
  const requireLogin = () => navigate('/login');

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
            <Typography variant="h4" component="h2">Find a doctor</Typography>
            <Typography variant="body1" color="text.secondary">
              Search by name or specialty — sign in to view a profile and book.
            </Typography>
          </Stack>

          {/* Guest search controls */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <TextField
              label="Doctor name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              disabled={loginGate}
            />
            <TextField
              select
              label="Specialty"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              disabled={loginGate}
              fullWidth
            >
              <MenuItem value={ALL}>All specialties</MenuItem>
              {specialties.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" disableElevation onClick={handleSearch} disabled={loginGate}>
              Search
            </Button>
          </Stack>

          {loginGate ? (
            <Alert
              severity="info"
              action={<Button color="inherit" size="small" component={RouterLink} to="/login">Log in</Button>}
            >
              You&apos;ve used your free searches — log in to keep browsing every doctor.
            </Alert>
          ) : (
            applied && (
              <Typography variant="caption" color="text.secondary">
                {searchesLeft > 0 ? `${searchesLeft} free search${searchesLeft === 1 ? '' : 'es'} left.` : 'No free searches left — next search asks you to log in.'}
              </Typography>
            )
          )}

          {results.length === 0 ? (
            <Typography variant="body2" color="text.secondary" marginTop={2}>
              No doctors match — try another name or specialty.
            </Typography>
          ) : (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center" flexWrap="wrap" useFlexGap marginTop={2}>
              {results.map((doc) => (
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
                  <CardActions>
                    <Button size="small" onClick={requireLogin}>View details</Button>
                    <Button size="small" variant="contained" disableElevation onClick={requireLogin}>
                      Get your appointment now
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          )}

          {specialties.length > 0 && (
            <Stack spacing={2} marginTop={6} alignItems="center">
              <Typography variant="overline" color="text.secondary">Specialties we cover</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
                {specialties.map((s) => (
                  <Chip
                    key={s.id}
                    label={s.name}
                    variant="outlined"
                    clickable
                    onClick={() => searchBySpecialty(s.id)}
                  />
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
