import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function DaySchedulePage() {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // 00H → 24H slot list for the day. Click slot -> AppointmentDetailDialog.
  const { date } = useParams();
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Day Schedule — {date}</Typography>
      <Typography color="text.secondary">TODO: implement.</Typography>
    </Container>
  );
}
