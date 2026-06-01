import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography, Button, Alert } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { capturePayment, verifyPayment } from '../../api/payments.js';

const PENDING_KEY = 'uc_pending_payment';

/**
 * PayPal redirects the buyer back here (return_url) after they approve. We pull
 * the pending payment id stashed before the redirect and capture it on the
 * backend. If the capture was interrupted we fall back to /verify, which
 * re-syncs against PayPal.
 */
export default function PaymentReturnPage() {
  const navigate = useNavigate();
  const [state, setState] = useState('working'); // working | done | failed
  const [message, setMessage] = useState('Finalising your payment…');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // guard React 18 StrictMode double-invoke
    ran.current = true;

    let pending = null;
    try {
      pending = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null');
    } catch {
      pending = null;
    }

    if (!pending?.paymentId) {
      setState('failed');
      setMessage('No payment in progress.');
      return;
    }

    (async () => {
      try {
        await capturePayment(pending.paymentId);
        localStorage.removeItem(PENDING_KEY);
        setState('done');
        setMessage('Payment complete — your appointment is booked and paid.');
      } catch {
        try {
          await verifyPayment(pending.paymentId);
          localStorage.removeItem(PENDING_KEY);
          setState('done');
          setMessage('Payment verified — your appointment is booked and paid.');
        } catch (err) {
          setState('failed');
          setMessage(err?.message || 'We could not confirm your payment.');
        }
      }
    })();
  }, []);

  return (
    <Container maxWidth="sm">
      <Stack spacing={3} marginTop={8} alignItems="center">
        {state === 'working' && <LoadingSpinner />}
        {state === 'done' && <Alert severity="success">{message}</Alert>}
        {state === 'failed' && <Alert severity="warning">{message}</Alert>}
        <Typography variant="body2" color="text.secondary">
          {state === 'working' ? message : ''}
        </Typography>
        {state !== 'working' && (
          <Button variant="contained" disableElevation onClick={() => navigate('/patient/appointments')}>
            Go to my appointments
          </Button>
        )}
      </Stack>
    </Container>
  );
}
