import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Typography } from '@mui/material';
import { listSpecialties } from '../../api/specialties.js';
import { approveUser, rejectUser } from '../../api/users.js';

/**
 * @param {{ open: boolean, onClose: () => void, user?: import('../../schema/schema.js').User }} props
 */
export default function ApproveUserDialog({ open, onClose, user, onUpdated }) {
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!open) return undefined;
    setLoadingSpecs(true);
    listSpecialties()
      .then((data) => {
        if (!mounted) return;
        setSpecialties(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setSpecialties([]);
      })
      .finally(() => {
        if (mounted) setLoadingSpecs(false);
      });
    return () => { mounted = false; };
  }, [open]);

  const specialtyName = (() => {
    if (!user || !user.specialty_id) return '';
    const s = specialties.find((sp) => sp.id === user.specialty_id);
    return s ? s.name : '';
  })();

  const handleApprove = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const res = await approveUser(user.id);
      if (onUpdated) onUpdated(res);
      onClose();
    } catch (_) {
      setActionError('Failed to approve user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const res = await rejectUser(user.id);
      if (onUpdated) onUpdated(res);
      onClose();
    } catch (_) {
      setActionError('Failed to reject user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Approve user</DialogTitle>
      <DialogContent>
        {user ? (
          <Stack spacing={2} marginTop={1}>
            <TextField label="Name" value={user.name || ''} disabled fullWidth />
            <TextField label="Role" value={user.role || ''} disabled fullWidth />
            <TextField label="Email" value={user.email || ''} disabled fullWidth />
            {user.role === 'doctor' && (
              <TextField
                label="Specialty"
                value={loadingSpecs ? 'Loading…' : (specialtyName || '')}
                disabled
                fullWidth
              />
            )}
            <TextField label="Description" value={user.description || ''} disabled multiline rows={3} fullWidth />
            {actionError && <Typography color="error">{actionError}</Typography>}
          </Stack>
        ) : (
          <Typography color="text.secondary">No user selected.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleReject} color="warning" disabled={!user || submitting}>Reject</Button>
        <Button onClick={handleApprove} color="primary" variant="contained" disabled={!user || submitting}>Approve</Button>
      </DialogActions>
    </Dialog>
  );
}
