import { useEffect, useState } from 'react';
import { Container, Stack, Typography, Snackbar, Alert } from '@mui/material';
import DocUpdateRequestsList from '../../components/admin/DocUpdateRequestsList.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { listPendingRequests, setDocRequestStatus } from '../../lib/docUpdateRequestsStore.js';

/**
 * Admin review page for ALL pending doctor document-update requests. Approving
 * patches the new resume/license onto the doctor's profile server-side;
 * rejecting leaves their current documents untouched.
 */
export default function PendingDocsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    let mounted = true;
    listPendingRequests()
      .then((reqs) => { if (mounted) setRequests(Array.isArray(reqs) ? reqs : []); })
      .catch(() => { if (mounted) setRequests([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  async function review(req, action) {
    try {
      await setDocRequestStatus(req.id, action);
      setRequests(await listPendingRequests());
      setSeverity('success');
      setToast(action === 'approved'
        ? `Approved — ${req.doctor_name || 'the doctor'}'s documents are updated.`
        : 'Request rejected.');
    } catch (err) {
      setSeverity('warning');
      setToast(err?.message || 'Could not update the request.');
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={1} marginTop={4} marginBottom={6}>
        <Typography variant="h4" component="h1">Document requests</Typography>
        <Typography variant="body2" color="text.secondary">
          Doctors who want to change their resume or license file a request here. Review the
          proposed file, then approve it (it replaces their current document) or reject it.
        </Typography>
        <DocUpdateRequestsList
          requests={requests}
          onApprove={(r) => review(r, 'approved')}
          onReject={(r) => review(r, 'rejected')}
        />
      </Stack>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={severity} onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </Container>
  );
}
