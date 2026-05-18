import { Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h3" gutterBottom marginTop={8}>404</Typography>
      <Typography color="text.secondary" paragraph>
        That page doesn’t exist.
      </Typography>
      <Button variant="contained" disableElevation component={RouterLink} to="/">
        Back to home
      </Button>
    </Container>
  );
}
