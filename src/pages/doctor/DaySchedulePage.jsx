import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, Typography, Box,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, Button, Chip
} from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AppointmentDetailDialog from './AppointmentDetailDialog.jsx';
import { listAppointmentsForDoctorOnDate } from '../../api/appointments.js';
import { listAvailabilityForDoctor } from '../../api/availability.js';
import { useAuth } from '../../hooks/useAuth.js';

function generateSlots(startTime, endTime) {
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  
  let current = sh * 60 + sm;
  const end = eh * 60 + em;
  
  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    current += 30; // 30-min steps
  }
  return slots;
}

const getStatusColor = (status) => {
  switch(status) {
    case 'confirmed': return 'primary';
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    case 'pending': return 'warning';
    default: return 'default';
  }
};

export default function DaySchedulePage() {
  const { date } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [patients, setPatients] = useState({});
  
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
        setLoading(true);
        // 1. Fetch availability for slots
        const availabilities = await listAvailabilityForDoctor(user?.id);
        const dayAvail = availabilities.find(a => a.date === date);
        const start = (dayAvail?.start_time || '09:00').slice(0, 5);
        const end = (dayAvail?.end_time || '17:00').slice(0, 5);

        const timeSlots = generateSlots(start, end);

        // 2. Fetch appointments — names are embedded, no user lookups needed.
        const appts = await listAppointmentsForDoctorOnDate(user?.id, date);
        const apptMap = {};
        const patMap = {};
        for (const appt of appts) {
          apptMap[String(appt.time).slice(0, 5)] = appt; // backend time is HH:MM:SS
          patMap[appt.patient_id] = { id: appt.patient_id, name: appt.patient_name };
        }

        if (mounted) {
          setSlots(timeSlots);
          setAppointments(apptMap);
          setPatients(patMap);
        }
      } catch (err) {
        console.error("Failed to load schedule", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    loadData();
    return () => { mounted = false; };
  }, [date]);

  const handleRowClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
        <Typography variant="h4">Day Schedule — {date}</Typography>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slots.map((time) => {
                const appt = appointments[time];
                const isOccupied = !!appt;
                const patient = isOccupied ? patients[appt.patient_id] : null;

                return (
                  <TableRow 
                    key={time} 
                    hover={isOccupied}
                    onClick={() => isOccupied && handleRowClick(appt.id)}
                    sx={{ cursor: isOccupied ? 'pointer' : 'default' }}
                  >
                    <TableCell width="120">{time}</TableCell>
                    
                    {isOccupied ? (
                      <>
                        <TableCell>{patient ? patient.name : 'Unknown Patient'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={appt.status} 
                            color={getStatusColor(appt.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic' }}>free</TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" color="inherit">Block</Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {dialogOpen && (
        <AppointmentDetailDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          appointmentId={selectedAppointmentId}
        />
      )}
    </Container>
  );
}
