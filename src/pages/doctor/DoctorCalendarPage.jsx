import { Container, Typography } from '@mui/material';

export default function DoctorCalendarPage() {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // Month calendar (MUI DateCalendar dynamic-data). Each day cell shows the
  // appointment count for that day (replaces the clock icon — sketch note).
  // "+" on an empty day opens ConfirmAvailableDialog.
  // Clicking a day navigates to /doctor/day/:date (DaySchedulePage).
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Doctor Calendar</Typography>
      <Typography color="text.secondary">TODO: implement.</Typography>
    </Container>
  );
}
