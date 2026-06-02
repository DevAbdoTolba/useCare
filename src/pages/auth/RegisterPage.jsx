import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { signup as apiSignup } from '../../api/http.js';
import { listSpecialties } from '../../api/specialties.js';
import DocumentInput, { isDocValue } from '../../components/common/DocumentInput.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { isValidPhone } from '../../lib/format.js';

// Signup offers only female / male (no "other").
const SIGNUP_GENDERS = ['female', 'male'];

/** Where each role lands after registering. */
const HOME_BY_ROLE = {
  doctor: '/doctor',
  patient: '/patient',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sentinel value for the "propose a new specialty" option in the select.
const SUGGEST_SPECIALTY = '__suggest__';

// Today (YYYY-MM-DD) — DOB can't be in the future.
const TODAY_ISO = new Date().toISOString().slice(0, 10);

// Non-breaking space: keeps the helperText line reserved so showing/clearing
// a validation message never shifts the layout below the field.
const HELPER_PLACEHOLDER = ' ';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [specialties, setSpecialties] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      role: 'patient',
      name: '',
      email: '',
      password: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      specialty_id: '',
      suggested_specialty: '',
      resume_url: '',
      license_url: '',
      hourly_rate: '',
      description: '',
    },
  });

  const role = watch('role');
  const specialtyId = watch('specialty_id');
  const isProposing = specialtyId === SUGGEST_SPECIALTY;

  useEffect(() => {
    listSpecialties().then(setSpecialties).catch(() => setSpecialties([]));
  }, []);

  async function onSubmit(values) {
    setSubmitError('');
    const isDoctor = values.role === 'doctor';
    const proposing = isDoctor && values.specialty_id === SUGGEST_SPECIALTY;
    try {
      const { user } = await apiSignup({
        name: values.name,
        email: values.email,
        password: values.password,
        phone_number: values.phone_number,
        date_of_birth: values.date_of_birth,
        gender: values.gender,
        role: values.role,
        // The backend keeps doctor-only fields on DoctorProfile (see http.signup).
        // A doctor either picks an existing specialty or proposes a new one,
        // which files a suggestion the admin approves with the account.
        specialty_id: isDoctor && !proposing ? Number(values.specialty_id) : null,
        suggested_specialty: proposing ? values.suggested_specialty.trim() : '',
        resume_url: isDoctor ? values.resume_url : '',
        license_url: isDoctor ? values.license_url : '',
        hourly_rate: isDoctor ? Number(values.hourly_rate) : null,
        description: isDoctor ? values.description : '',
      });
      setAuthUser(user);
      navigate(HOME_BY_ROLE[user.role] ?? '/patient');
    } catch (err) {
      setSubmitError(err?.message || 'Could not create your account. Please try again.');
    }
  }

  return (
    <Container maxWidth="sm">
      <Stack spacing={3} marginTop={6} marginBottom={6} component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">Create your account</Typography>
          <Typography variant="body2" color="text.secondary">
            Join useCare as a patient or a doctor.
          </Typography>
        </Stack>

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              exclusive
              fullWidth
              color="primary"
              value={field.value}
              onChange={(_e, next) => { if (next) field.onChange(next); }}
            >
              <ToggleButton value="patient">Patient</ToggleButton>
              <ToggleButton value="doctor">Doctor</ToggleButton>
            </ToggleButtonGroup>
          )}
        />

        <Controller
          name="name"
          control={control}
          rules={{ required: 'Full name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Full name"
              fullWidth
              autoComplete="name"
              error={Boolean(errors.name)}
              helperText={errors.name?.message || HELPER_PLACEHOLDER}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email?.message || HELPER_PLACEHOLDER}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              autoComplete="new-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message || HELPER_PLACEHOLDER}
            />
          )}
        />

        <Controller
          name="phone_number"
          control={control}
          rules={{
            required: 'Phone number is required',
            validate: (v) => isValidPhone(v) || 'Enter a valid phone number (7–15 digits)',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone number"
              fullWidth
              autoComplete="tel"
              error={Boolean(errors.phone_number)}
              helperText={errors.phone_number?.message || HELPER_PLACEHOLDER}
            />
          )}
        />

        <Controller
          name="date_of_birth"
          control={control}
          rules={{
            required: 'Date of birth is required',
            validate: (v) => !v || v <= TODAY_ISO || 'Date of birth cannot be in the future',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Date of birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: TODAY_ISO }}
              error={Boolean(errors.date_of_birth)}
              helperText={errors.date_of_birth?.message || HELPER_PLACEHOLDER}
            />
          )}
        />

        <Controller
          name="gender"
          control={control}
          rules={{ required: 'Please select a gender' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Gender"
              fullWidth
              error={Boolean(errors.gender)}
              helperText={errors.gender?.message || HELPER_PLACEHOLDER}
            >
              {SIGNUP_GENDERS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {role === 'doctor' && (
          <>
            <Controller
              name="specialty_id"
              control={control}
              rules={{ required: 'Please select a specialty' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Specialty"
                  fullWidth
                  error={Boolean(errors.specialty_id)}
                  helperText={errors.specialty_id?.message || HELPER_PLACEHOLDER}
                >
                  {specialties.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                  <Divider />
                  <MenuItem value={SUGGEST_SPECIALTY}>+ Propose a new specialty…</MenuItem>
                </TextField>
              )}
            />

            {isProposing && (
              <Controller
                name="suggested_specialty"
                control={control}
                rules={{
                  validate: (v) =>
                    !isProposing || (v && v.trim().length > 1) || 'Name the specialty you want to propose',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New specialty name"
                    fullWidth
                    error={Boolean(errors.suggested_specialty)}
                    helperText={
                      errors.suggested_specialty?.message ||
                      'The admin reviews this and approves it together with your account.'
                    }
                  />
                )}
              />
            )}

            <Controller
              name="resume_url"
              control={control}
              rules={{ validate: (v) => isDocValue(v) || 'Add a resume — paste a link or upload a file' }}
              render={({ field }) => (
                <DocumentInput
                  label="Resume / CV"
                  value={field.value}
                  onChange={field.onChange}
                  error={Boolean(errors.resume_url)}
                  helperText={errors.resume_url?.message || 'The admin reviews this before approving you.'}
                />
              )}
            />

            <Controller
              name="license_url"
              control={control}
              rules={{ validate: (v) => isDocValue(v) || 'Add your license — paste a link or upload a file' }}
              render={({ field }) => (
                <DocumentInput
                  label="Medical license"
                  value={field.value}
                  onChange={field.onChange}
                  error={Boolean(errors.license_url)}
                  helperText={errors.license_url?.message || 'Verified by the admin to confirm you can practice.'}
                />
              )}
            />

            <Controller
              name="hourly_rate"
              control={control}
              rules={{
                required: 'Set your hourly consultation rate',
                min: { value: 1, message: 'Rate must be greater than 0' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Hourly rate (USD)"
                  type="number"
                  fullWidth
                  InputProps={{ startAdornment: <Typography color="text.secondary" marginRight={0.5}>$</Typography> }}
                  error={Boolean(errors.hourly_rate)}
                  helperText={errors.hourly_rate?.message || 'Patients see this before they book.'}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="About you"
                  placeholder="Experience, focus areas, qualifications…"
                  fullWidth
                  multiline
                  minRows={3}
                  helperText={HELPER_PLACEHOLDER}
                />
              )}
            />
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          disableElevation
          size="large"
          fullWidth
          disabled={isSubmitting}
        >
          Create account
        </Button>

        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Divider>Already a member?</Divider>

        <Button component={RouterLink} to="/login" fullWidth>
          Log in instead
        </Button>
      </Stack>
    </Container>
  );
}
