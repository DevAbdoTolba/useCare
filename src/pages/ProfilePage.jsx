import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Stack,
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Chip,
  Divider,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../hooks/useAuth.js';
import { listSpecialties } from '../api/specialties.js';
import { GENDERS } from '../schema/schema.js';
import { initialOf } from '../lib/format.js';

/** Editable form shape from the current user. */
const formFrom = (u) => ({
  name: u?.name ?? '',
  phone_number: u?.phone_number ?? '',
  gender: u?.gender ?? '',
  date_of_birth: u?.date_of_birth ?? '',
  specialty_id: u?.specialty_id ?? '',
  description: u?.description ?? '',
});

/**
 * Unified profile page for every role. Everyone gets the basics (name, phone,
 * gender, date of birth); doctors also get specialty + description. The pencil
 * toggles edit mode and Save persists through the auth store (localStorage).
 */
export default function ProfilePage() {
  const { user, updateCurrentUser } = useAuth();
  const isDoctor = user?.role === 'doctor';

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => formFrom(user));
  const [specialties, setSpecialties] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (isDoctor) listSpecialties().then(setSpecialties).catch(() => setSpecialties([]));
  }, [isDoctor]);

  const specialtyName = useMemo(() => {
    const s = specialties.find((sp) => sp.id === user?.specialty_id);
    return s ? s.name : '—';
  }, [specialties, user?.specialty_id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function startEdit() {
    setForm(formFrom(user));
    setEditing(true);
  }

  function cancelEdit() {
    setForm(formFrom(user));
    setEditing(false);
  }

  function save() {
    const patch = {
      name: form.name,
      phone_number: form.phone_number,
      gender: form.gender,
      date_of_birth: form.date_of_birth,
    };
    if (isDoctor) {
      patch.specialty_id = form.specialty_id === '' ? null : Number(form.specialty_id);
      patch.description = form.description;
    }
    updateCurrentUser(patch);
    setEditing(false);
    setToast('Profile updated.');
  }

  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <Stack spacing={3} marginTop={2} marginBottom={6}>
        <Typography variant="h4" component="h1">My profile</Typography>

        <Card variant="outlined">
          <CardHeader
            avatar={<Avatar>{initialOf(user.name)}</Avatar>}
            title={user.name}
            subheader={user.email}
            action={
              !editing ? (
                <IconButton onClick={startEdit} aria-label="Edit profile">
                  <EditIcon />
                </IconButton>
              ) : null
            }
          />
          <CardContent>
            {!editing ? (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={user.role} color="primary" variant="outlined" />
                  {user.status && (
                    <Chip label={`Status: ${user.status}`} color={user.status === 'approved' ? 'success' : 'warning'} />
                  )}
                  {isDoctor && <Chip label={`Specialty: ${specialtyName}`} variant="outlined" />}
                </Stack>
                <Divider />
                <ReadRow label="Phone" value={user.phone_number} />
                <ReadRow label="Gender" value={user.gender} />
                <ReadRow label="Date of birth" value={user.date_of_birth} />
                {isDoctor && <ReadRow label="About" value={user.description} />}
              </Stack>
            ) : (
              <Stack spacing={2}>
                <TextField label="Full name" value={form.name} onChange={set('name')} fullWidth />
                <TextField label="Phone number" value={form.phone_number} onChange={set('phone_number')} fullWidth />
                <TextField select label="Gender" value={form.gender} onChange={set('gender')} fullWidth>
                  {GENDERS.map((g) => (
                    <MenuItem key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Date of birth"
                  type="date"
                  value={form.date_of_birth}
                  onChange={set('date_of_birth')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                {isDoctor && (
                  <>
                    <TextField select label="Specialty" value={form.specialty_id} onChange={set('specialty_id')} fullWidth>
                      <MenuItem value="">None</MenuItem>
                      {specialties.map((s) => (
                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                      ))}
                    </TextField>
                    <TextField label="About you" value={form.description} onChange={set('description')} fullWidth multiline minRows={3} />
                  </>
                )}

                <Box>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button onClick={cancelEdit}>Cancel</Button>
                    <Button variant="contained" disableElevation onClick={save}>Save</Button>
                  </Stack>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </Container>
  );
}

function ReadRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value || '—'}</Typography>
    </Stack>
  );
}
