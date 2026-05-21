import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { loginLocal } from '../../auth/localAuthStore.js';
import { useAuth } from '../../hooks/useAuth.js';

/** Where each role lands after a successful login. */
const HOME_BY_ROLE = {
  admin: '/admin',
  doctor: '/doctor',
  patient: '/patient',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Non-breaking space: keeps the helperText line reserved so showing/clearing
// a validation message never shifts the layout below the field.
const HELPER_PLACEHOLDER = ' ';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [submitError, setSubmitError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit({ email, password }) {
    setSubmitError('');
    try {
      const user = loginLocal(email, password);
      setAuthUser(user);
      navigate(HOME_BY_ROLE[user.role] ?? '/patient');
    } catch {
      setSubmitError('Could not sign you in. Please check your email and password.');
    }
  }

  return (
    <Container maxWidth="xs">
      <Stack spacing={3} marginTop={8} component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">Welcome back</Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your useCare account.
          </Typography>
        </Stack>

        {submitError && <Alert severity="error">{submitError}</Alert>}

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
              autoFocus
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
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message || HELPER_PLACEHOLDER}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          disableElevation
          size="large"
          fullWidth
          disabled={isSubmitting}
        >
          Login
        </Button>

        <Divider>New here?</Divider>

        <Button component={RouterLink} to="/register" fullWidth>
          Create an account
        </Button>
      </Stack>
    </Container>
  );
}
