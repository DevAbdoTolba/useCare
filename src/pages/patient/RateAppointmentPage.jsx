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
  Rating,
  TextField,
} from '@mui/material';
import { getAppointment } from '../../api/appointments.js';
import { rateAppointment } from '../../lib/ratingsStore.js';
import { timeLabel } from '../../lib/format.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

/**
 * Standalone "rate your doctor" page for a completed appointment. Linked from
 * the post-visit email and from the patient's appointment history + details.
 */
export default function RateAppointmentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appt, setAppt] = useState(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAppointment(appointmentId)
      .then((a) => {
        if (!mounted) return;
        setAppt(a);
        if (a?.my_rating) {
          setStars(a.my_rating.stars ?? 0);
          setComment(a.my_rating.comment ?? '');
        }
      })
      .catch((e) => { if (mounted) setError(e?.message || 'Could not load the appointment.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [appointmentId]);

  async function submit() {
    if (!stars) { setError('Please pick a star rating.'); return; }
    setSaving(true);
    setError('');
    try {
      await rateAppointment(appt, stars, comment);
      setDone(true);
    } catch (e) {
      setError(e?.message || 'Could not save your rating.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <LoadingSpinner />
      </Container>
    );
  }

  const alreadyRated = Boolean(appt?.my_rating) || done;
  const canRate = appt && appt.status === 'completed';

  return (
    <Container maxWidth="sm">
      <Stack spacing={3} marginTop={6} marginBottom={6}>
        <Typography variant="h4" component="h1">Rate your visit</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!appt ? (
          <Alert severity="warning">Appointment not found.</Alert>
        ) : !canRate ? (
          <Alert severity="info">
            You can rate this appointment once the visit is complete.
          </Alert>
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

                {alreadyRated ? (
                  <Alert severity="success">
                    Thanks! You rated this visit {stars}/5.
                  </Alert>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      How was your visit with {appt.doctor_name}?
                    </Typography>
                    <Rating value={stars} onChange={(_e, v) => { setStars(v ?? 0); setError(''); }} />
                    <TextField
                      label="Add a comment (optional)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      fullWidth
                      multiline
                      minRows={3}
                    />
                    <Button variant="contained" disableElevation onClick={submit} disabled={saving}>
                      {saving ? 'Saving…' : 'Submit rating'}
                    </Button>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        <Button onClick={() => navigate('/patient/appointments')}>Back to my appointments</Button>
      </Stack>
    </Container>
  );
}
