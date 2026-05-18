import { Container, Typography } from '@mui/material';

export default function PatientHomePage() {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // "Select Doctor from the table below" + search/filter by specialty +
  // doctor table. Row click navigates to /patient/doctor/:doctorId/week.
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Pick a doctor</Typography>
      <Typography color="text.secondary">TODO: implement.</Typography>
    </Container>
  );
}
