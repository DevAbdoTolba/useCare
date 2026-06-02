import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Typography, Divider } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { listSpecialties } from '../../api/specialties.js';
import { approveUser, rejectUser, getUser } from '../../api/users.js';

/**
 * @param {{ open: boolean, onClose: () => void, user?: import('../../schema/schema.js').User }} props
 */
export default function ApproveUserDialog({ open, onClose, user, onUpdated }) {
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  // Full detail incl. doctor docs (the list payload doesn't carry resume/license).
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!open || !user) { setDetails(null); return; }
    if (user.role !== 'doctor') { setDetails(user); return; }
    let mounted = true;
    getUser(user.id)
      .then((d) => { if (mounted) setDetails(d); })
      .catch(() => { if (mounted) setDetails(user); });
    return () => { mounted = false; };
  }, [open, user]);

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

  // Prefer the enriched detail (carries doctor docs) but fall back to the prop.
  const u = details ?? user;

  const specialtyName = (() => {
    if (!u || !u.specialty_id) return u?.specialty || '';
    const s = specialties.find((sp) => sp.id === u.specialty_id);
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
            <TextField label="Description" value={u.description || ''} disabled multiline rows={3} fullWidth />

            {user.role === 'doctor' && (
              <>
                <Divider textAlign="left">
                  <Typography variant="overline">Verification documents</Typography>
                </Divider>
                <Typography variant="body2" color="text.secondary">
                  Review the resume and license before approving — they&apos;re the basis for the decision.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    startIcon={<DescriptionIcon />}
                    variant="outlined"
                    component="a"
                    href={u.resume_url || undefined}
                    target="_blank"
                    rel="noopener"
                    disabled={!u.resume_url}
                    fullWidth
                  >
                    {u.resume_url ? 'Open resume' : 'No resume'}
                  </Button>
                  <Button
                    startIcon={<VerifiedUserIcon />}
                    variant="outlined"
                    component="a"
                    href={u.license_url || undefined}
                    target="_blank"
                    rel="noopener"
                    disabled={!u.license_url}
                    fullWidth
                  >
                    {u.license_url ? 'Open license' : 'No license'}
                  </Button>
                </Stack>
              </>
            )}

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
