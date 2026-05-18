import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function AvailableSlotsPage() {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // Table: Date | Time | Doctor | Book. Click Book -> BookAppointmentDialog.
  const { doctorId } = useParams();
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Available slots (doctor #{doctorId})</Typography>
      <Typography color="text.secondary">TODO: implement.</Typography>
    </Container>
  );
}
