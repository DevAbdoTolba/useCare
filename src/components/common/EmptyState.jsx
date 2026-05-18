import { Box, Typography } from '@mui/material';

/** Placeholder for empty tables / lists. */
export default function EmptyState({ title = 'Nothing here yet', message }) {
  return (
    <Box paddingY={6} textAlign="center">
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {message ? <Typography variant="body2" color="text.secondary">{message}</Typography> : null}
    </Box>
  );
}
