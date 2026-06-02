import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Stack,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { getAppointment } from '../../api/appointments.js';
import { createPayment, capturePayment } from '../../api/payments.js';
import { timeLabel } from '../../lib/format.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const PENDING_KEY = 'uc_pending_payment';

/**
 * Standalone payment page for an already-booked but still-unpaid appointment.
 * Reached from the "Pay now" link on an unpaid appointment. Runs the same
 * PayPal flow as booking: create the order, redirect to approval (real sandbox)
 * or capture immediately (demo), then come back via /patient/payment-return.
 */
export default function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appt, setAppt] = useState(null);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAppointment(appointmentId)
      .then((a) => { if (mounted) setAppt(a); })
      .catch((e) => { if (mounted) setError(e?.message || 'Could not load the appointment.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [appointmentId]);

  async function pay() {
    if (!appt) return;
    setPaying(true);
    setError('');
    try {
      const ret = `${window.location.origin}/patient/payment-return`;
      const order = await createPayment(appt.id, { returnUrl: ret, cancelUrl: ret });
      if (order.approval_url) {
        localStorage.setItem(PENDING_KEY, JSON.stringify({ paymentId: order.id }));
        window.location.href = order.approval_url;
        return;
      }
      // Demo mode (no PayPal creds): capture immediately, no redirect.
      await capturePayment(order.id);
      navigate('/patient/appointments');
    } catch (e) {
      setError(e?.message || 'Could not start the payment.');
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Stack spacing={3} marginTop={6} marginBottom={6}>
        <Typography variant="h4" component="h1">Pay for your appointment</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!appt ? (
          <Alert severity="warning">Appointment not found.</Alert>
        ) : appt.paid ? (
          <Alert severity="success">This appointment is already paid.</Alert>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{appt.doctor_name}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={appt.date} />
                  <Chip label={timeLabel(appt.time)} variant="outlined" />
                  {appt.doctor_specialty && <Chip label={appt.doctor_specialty} variant="outlined" />}
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography color="text.secondary">Consultation fee</Typography>
                  <Typography variant="h6">${appt.fee ?? 0}</Typography>
                </Stack>

                <Button
                  variant="contained"
                  disableElevation
                  fullWidth
                  onClick={pay}
                  disabled={paying}
                >
                  {paying ? 'Starting…' : `Pay $${appt.fee ?? 0} with PayPal`}
                </Button>
                <Typography variant="caption" color="text.secondary">
                  You&apos;ll be redirected to PayPal (sandbox) to approve. Without PayPal
                  credentials the backend captures instantly in demo mode.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}

        <Button onClick={() => navigate('/patient/appointments')}>Back to my appointments</Button>
      </Stack>
    </Container>
  );
}
