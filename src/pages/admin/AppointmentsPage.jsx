import { Container, Typography ,Button , Chip} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {listAppointments, cancelAppointment} from '../../api/appointments';
import {listUsers} from '../../api/users';
import { listSpecialties } from '../../api/specialties';
import {APPOINTMENT_STATUSES} from '../../schema/schema';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useEffect, useState } from 'react';


export default function AppointmentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'time', headerName: 'Time', width: 150 },
    { field: 'patient', headerName: 'Patient', width: 150 },
    { field: 'doctor', headerName: 'Doctor', width: 150 },
    { field: 'specialty', headerName: 'Specialty', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell : (params) => {
        const colorMap = {
          pending : {color : 'warning'},
          confirmed : {color : 'success'},
          cancelled : {color : 'error'},
          completed : {color : 'info'}, 
        };
        const {color} = colorMap[params.value] ?? {color : 'default'};
        return <Chip label={params.value} color={color} size='small'/>;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <>
          <Button variant="outlined" onClick={() => handleView(params.row)}>View</Button>
          <Button variant="outlined" onClick={() => handleCancel(params.row)}>Cancel</Button>
        </>
      ),
    },
  ];

useEffect(() => {
  const fetchAll = async () => {
    const [appointments, users, specialties] = await Promise.all([
      listAppointments(),
      listUsers(),
      listSpecialties(),
    ]);

    setRows(appointments.map(item => {
      const patient = users.find(u => u.id === item.patient_id);
      const doctor = users.find(u => u.id === item.doctor_id);
      const specialty = specialties.find(s => s.id === doctor?.specialty_id);

      return {
        id: item.id,
        date: item.date,
        time: item.time,
        patient: patient?.name ?? 'Unknown',
        doctor: doctor?.name ?? 'Unknown',
        specialty: specialty?.name ?? 'Unknown',
        status: item.status,
      };
    }));

    setLoading(false);
  };

  fetchAll();
}, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Appointments</Typography>
      {
        loading ? <LoadingSpinner/> : 
          <>
            <DataGrid rows={rows} columns={columns} sx={{ mt: 2 }} getRowId={(row) => row.id} colorr />
          </>
      }
    </Container>
  );
}