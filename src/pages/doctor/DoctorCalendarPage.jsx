import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Badge, IconButton } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { listAppointmentsForDoctor } from '../../api/appointments.js';
import ConfirmAvailableDialog from './ConfirmAvailableDialog.jsx';
import { Margin } from '@mui/icons-material';

const DOCTOR_ID = 2; // Hardcoded per spec

function CustomDay(props) {
  const { day, outsideCurrentMonth, counts, onEmptyDayClick, ...other } = props;
  const dateStr = day.format('YYYY-MM-DD');
  const apptCount = counts[dateStr] || 0;

  if (outsideCurrentMonth) {
    return <PickersDay day={day} outsideCurrentMonth={outsideCurrentMonth} {...other} />;
  }

  // If there are appointments, show the count instead of a standard badge if desired,
  // or we can use a Badge. Let's just render the number inside a Badge.
  // Wait, the wireframe says "the day cell shows the appointment count for that day OR a + button".
  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={apptCount > 0 ? apptCount : undefined}
      color="primary"
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
      {apptCount === 0 && !outsideCurrentMonth && (
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: -8, right: -9, opacity: 0.7, width: '100%', height: '100%' }}
          onClick={(e) => {
            e.stopPropagation();
            onEmptyDayClick(dateStr);
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      )}
    </Badge>
  );
}

export default function DoctorCalendarPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmptyDate, setSelectedEmptyDate] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;
    listAppointmentsForDoctor(DOCTOR_ID).then((data) => {
      if (mounted) setAppointments(data);
    });
    return () => { mounted = false; };
  }, [refreshTrigger]);

  const counts = useMemo(() => {
    const acc = {};
    appointments.forEach((appt) => {
      acc[appt.date] = (acc[appt.date] || 0) + 1;
    });
    return acc;
  }, [appointments]);

  const handleDayClick = (newValue) => {
    const dateStr = newValue.format('YYYY-MM-DD');
    const apptCount = counts[dateStr] || 0;
    
    if (apptCount > 0) {
      navigate(`/doctor/day/${dateStr}`);
    }
  };

  const handleEmptyDayClick = (dateStr) => {
    setSelectedEmptyDate(dateStr);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Doctor Calendar</Typography>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <DateCalendar
          onChange={handleDayClick}
          slots={{
            day: CustomDay,
          }}
          slotProps={{
            day: {
              counts,
              onEmptyDayClick: handleEmptyDayClick,
            },
          }}
        />
      </Box>

      <ConfirmAvailableDialog
        open={dialogOpen}
        date={selectedEmptyDate}
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </Container>
  );
}
