import { Container, Typography, Box } from '@mui/material';

export default function AppFooter() {
  // TODO: links, social, legal — per final design.
  return (
    <Box paddingY={4} marginTop={6}>
      <Container maxWidth="md">
        <Typography variant="body2" color="text.secondary" align="center">
          © useCare — built with love.
        </Typography>
      </Container>
    </Box>
  );
}
