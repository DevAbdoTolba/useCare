import {
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmptyState from '../common/EmptyState.jsx';

/**
 * Pending doctor document-update requests on the admin dashboard. Each row
 * links out to the proposed résumé + license so the admin can review before
 * approving (which patches the doctor) or rejecting.
 */
export default function DocUpdateRequestsList({ requests, onApprove, onReject }) {
  return (
    <Box marginTop={3}>
      <Stack direction="row" spacing={1} alignItems="center" marginBottom={1}>
        <Typography variant="h6">Document update requests</Typography>
        {requests.length > 0 && <Chip size="small" color="warning" label={requests.length} />}
      </Stack>

      {requests.length === 0 ? (
        <EmptyState title="No document requests" />
      ) : (
        <Stack divider={<Divider flexItem />} spacing={1}>
          {requests.map((r) => (
            <Stack
              key={r.id}
              direction={{ xs: 'column', md: 'row' }}
              spacing={1}
              alignItems={{ md: 'center' }}
              justifyContent="space-between"
            >
              <Typography variant="subtitle2">{r.doctor_name || `Doctor #${r.doctor_id}`}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button size="small" startIcon={<DescriptionIcon />} component="a" href={r.resume_url || undefined} target="_blank" rel="noopener" disabled={!r.resume_url}>
                  Résumé
                </Button>
                <Button size="small" startIcon={<VerifiedUserIcon />} component="a" href={r.license_url || undefined} target="_blank" rel="noopener" disabled={!r.license_url}>
                  License
                </Button>
                <Button size="small" color="warning" onClick={() => onReject(r)}>Reject</Button>
                <Button size="small" variant="contained" disableElevation onClick={() => onApprove(r)}>Approve</Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
