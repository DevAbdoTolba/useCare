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
 * One document with its CURRENT file and (when the doctor proposed a change)
 * the NEW one highlighted. The admin always sees both documents — even the one
 * the doctor isn't changing — so they can review the full picture.
 */
function DocPair({ label, icon, current, proposed }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      alignItems={{ sm: 'center' }}
    >
      <Typography variant="overline" color="text.secondary" minWidth={72}>{label}</Typography>

      <Button
        size="small"
        variant="outlined"
        startIcon={icon}
        component="a"
        href={current || undefined}
        target="_blank"
        rel="noopener"
        disabled={!current}
      >
        {current ? 'Current' : 'None on file'}
      </Button>

      {proposed ? (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Button
            size="small"
            variant="contained"
            disableElevation
            color="primary"
            startIcon={icon}
            component="a"
            href={proposed}
            target="_blank"
            rel="noopener"
          >
            New
          </Button>
          <Chip size="small" color="primary" label="requested" />
        </Stack>
      ) : (
        <Chip size="small" variant="outlined" label="no change" />
      )}
    </Stack>
  );
}

/**
 * Pending doctor document-update requests. For each request the admin sees the
 * doctor's CURRENT resume and license side by side with any NEW (requested)
 * file highlighted, then approves (patches the doctor) or rejects.
 */
export default function DocUpdateRequestsList({ requests, onApprove, onReject, onViewAll, total }) {
  const count = total ?? requests.length;
  return (
    <Box marginTop={3}>
      <Stack direction="row" spacing={1} alignItems="center" marginBottom={1}>
        <Typography variant="h6">Document update requests</Typography>
        {count > 0 && <Chip size="small" color="warning" label={count} />}
      </Stack>

      {requests.length === 0 ? (
        <EmptyState title="No document requests" />
      ) : (
        <Stack divider={<Divider flexItem />} spacing={2}>
          {requests.map((r) => (
            <Stack key={r.id} spacing={1.5}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="subtitle2">{r.doctor_name || `Doctor #${r.doctor_id}`}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button size="small" color="warning" onClick={() => onReject(r)}>Reject</Button>
                  <Button size="small" variant="contained" disableElevation onClick={() => onApprove(r)}>Approve</Button>
                </Stack>
              </Stack>

              <DocPair
                label="Resume"
                icon={<DescriptionIcon />}
                current={r.current_resume_url}
                proposed={r.resume_url}
              />
              <DocPair
                label="License"
                icon={<VerifiedUserIcon />}
                current={r.current_license_url}
                proposed={r.license_url}
              />
            </Stack>
          ))}
        </Stack>
      )}

      {onViewAll && count > requests.length && (
        <Box marginTop={2}>
          <Button onClick={onViewAll}>View all {count} requests</Button>
        </Box>
      )}
    </Box>
  );
}
