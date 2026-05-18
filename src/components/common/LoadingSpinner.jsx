import { Box, CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <Box display="flex" justifyContent="center" paddingY={6}>
      <CircularProgress />
    </Box>
  );
}
