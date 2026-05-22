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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useAuth } from '../hooks/useAuth.js';
import { listSpecialties } from '../api/specialties.js';
import { addDocUpdateRequest, getPendingRequestForDoctor } from '../lib/docUpdateRequestsStore.js';
import { GENDERS } from '../schema/schema.js';
import { initialOf } from '../lib/format.js';

const URL_PATTERN = /^https?:\/\/.+/i;

/** Editable form shape from the current user. */
const formFrom = (u) => ({
  name: u?.name ?? '',
  phone_number: u?.phone_number ?? '',
  gender: u?.gender ?? '',
  date_of_birth: u?.date_of_birth ?? '',
  specialty_id: u?.specialty_id ?? '',
  hourly_rate: u?.hourly_rate ?? '',
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

  // Doctor document-update request (résumé/license — needs admin approval).
  const [docOpen, setDocOpen] = useState(false);
  const [docForm, setDocForm] = useState({ resume_url: '', license_url: '' });
  const [docError, setDocError] = useState('');
  const [reqTick, setReqTick] = useState(0); // bump to re-read the pending request
  const pendingDocReq = isDoctor && reqTick >= 0 ? getPendingRequestForDoctor(user?.id) : null;

  function openDocDialog() {
    setDocForm({ resume_url: user?.resume_url ?? '', license_url: user?.license_url ?? '' });
    setDocError('');
    setDocOpen(true);
  }

  function submitDocRequest() {
    const { resume_url, license_url } = docForm;
    if (!URL_PATTERN.test(resume_url) || !URL_PATTERN.test(license_url)) {
      setDocError('Both links must be valid URLs (https://…).');
      return;
    }
    addDocUpdateRequest(user, docForm);
    setReqTick((t) => t + 1);
    setDocOpen(false);
    setToast('Update requested — an admin will review it.');
  }

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
      patch.hourly_rate = form.hourly_rate === '' ? null : Number(form.hourly_rate);
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
                {isDoctor && <ReadRow label="Hourly rate" value={user.hourly_rate != null ? `$${user.hourly_rate}/hr` : null} />}
                {isDoctor && <ReadRow label="About" value={user.description} />}

                {isDoctor && (
                  <>
                    <Divider textAlign="left">
                      <Typography variant="overline">Verification documents</Typography>
                    </Divider>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <Button
                        startIcon={<DescriptionIcon />}
                        variant="outlined"
                        component="a"
                        href={user.resume_url || undefined}
                        target="_blank"
                        rel="noopener"
                        disabled={!user.resume_url}
                        fullWidth
                      >
                        {user.resume_url ? 'View résumé' : 'No résumé'}
                      </Button>
                      <Button
                        startIcon={<VerifiedUserIcon />}
                        variant="outlined"
                        component="a"
                        href={user.license_url || undefined}
                        target="_blank"
                        rel="noopener"
                        disabled={!user.license_url}
                        fullWidth
                      >
                        {user.license_url ? 'View license' : 'No license'}
                      </Button>
                    </Stack>
                    {pendingDocReq ? (
                      <Alert severity="info">
                        Document update requested — waiting for admin approval.
                      </Alert>
                    ) : (
                      <Box>
                        <Button onClick={openDocDialog}>Request document update</Button>
                      </Box>
                    )}
                  </>
                )}
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
                    <TextField
                      label="Hourly rate (USD)"
                      type="number"
                      value={form.hourly_rate}
                      onChange={set('hourly_rate')}
                      fullWidth
                      InputProps={{ startAdornment: <Typography color="text.secondary" marginRight={0.5}>$</Typography> }}
                    />
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

      <Dialog open={docOpen} onClose={() => setDocOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Request document update</DialogTitle>
        <DialogContent>
          <Stack spacing={2} marginTop={1}>
            <Typography variant="body2" color="text.secondary">
              New links go to the admin for approval — your current documents stay
              in place until they&apos;re reviewed.
            </Typography>
            <TextField
              label="Résumé / CV link"
              placeholder="https://…"
              value={docForm.resume_url}
              onChange={(e) => setDocForm((f) => ({ ...f, resume_url: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Medical license link"
              placeholder="https://…"
              value={docForm.license_url}
              onChange={(e) => setDocForm((f) => ({ ...f, license_url: e.target.value }))}
              fullWidth
            />
            {docError && <Typography variant="caption" color="error">{docError}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocOpen(false)}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={submitDocRequest}>Send request</Button>
        </DialogActions>
      </Dialog>

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
