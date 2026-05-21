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
import { registerLocal } from '../../auth/localAuthStore.js';
import { listSpecialties } from '../../api/specialties.js';
import { useAuth } from '../../hooks/useAuth.js';

// Signup offers only female / male (no "other").
const SIGNUP_GENDERS = ['female', 'male'];

/** Where each role lands after registering. */
const HOME_BY_ROLE = {
  doctor: '/doctor',
  patient: '/patient',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      description: '',
    },
  });

  const role = watch('role');

  useEffect(() => {
    listSpecialties().then(setSpecialties).catch(() => setSpecialties([]));
  }, []);

  async function onSubmit(values) {
    setSubmitError('');
    const isDoctor = values.role === 'doctor';
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone_number: values.phone_number,
      date_of_birth: values.date_of_birth,
      gender: values.gender,
      role: values.role,
      status: isDoctor ? 'pending' : 'approved',
      specialty_id: isDoctor ? Number(values.specialty_id) : null,
      description: isDoctor ? values.description : null,
    };
    try {
      const user = registerLocal(payload);
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

        {submitError && <Alert severity="error">{submitError}</Alert>}

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
          rules={{ required: 'Phone number is required' }}
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
          rules={{ required: 'Date of birth is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Date of birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
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
                </TextField>
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

        <Divider>Already a member?</Divider>

        <Button component={RouterLink} to="/login" fullWidth>
          Log in instead
        </Button>
      </Stack>
    </Container>
  );
}
