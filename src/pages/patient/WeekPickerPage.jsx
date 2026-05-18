import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function WeekPickerPage() {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // MUI WeekPicker. After picking a week, navigate to .../slots.
  const { doctorId } = useParams();
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Pick a week (doctor #{doctorId})</Typography>
      <Typography color="text.secondary">TODO: implement.</Typography>
    </Container>
  );
}
