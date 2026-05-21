import { Container, Typography ,Button , Chip, Card , CardContent , Snackbar , Alert} from '@mui/material';
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
  const [selectedRow , setSelectedRow] = useState(null);
  const [confirmOpen , setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [cancelFlag , SetCancelFlag] = useState(false);

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

  console.log(selectedRow);

  const handleCancel = () => {
  setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    cancelAppointment(selectedRow.id).then(() => {
    setRows(rows.map(r => r.id === selectedRow.id ? { ...r, status: 'cancelled' } : r));
      setConfirmOpen(false);
      setSelectedRow(null);
      setSnackbar({ open: true, message: 'Canceled', severity: 'warning' });
      setSelectedRow({ ...selectedRow, status: 'cancelled' });
    }).catch((err) => console.log(err));
   };
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Appointments</Typography>
      {
        loading ? <LoadingSpinner/> : 
          <>
            <Card>
              {
                selectedRow ? <CardContent>
                  <Typography variant="h6">Date: {selectedRow?.date} </Typography>
                  <br />
                  <Typography variant="h6">At: {selectedRow?.time}</Typography>
                  <br />
                  <Typography variant="h6">Patient Name: {selectedRow?.patient}</Typography>
                  <br/>
                  <Typography variant="h6">Doctor Name: {selectedRow?.doctor}</Typography>
                  <br />
                  <Typography variant="h6">Doctor's Specialty: {selectedRow?.specialty}</Typography>
                  <br />
                  <Typography variant="h6">Appointment Status: {selectedRow?.status}</Typography>
                  <br />
                  {(selectedRow?.status === 'confirmed' ||selectedRow?.status ===  'pending' ) && <> <Button variant="outlined" onClick={() => handleCancel() }>Cancel</Button> </>}
                  <br />
                </CardContent> :

                <CardContent>
                  <Typography variant="h6">Click on a recored to view it's details</Typography>
                  <br />
                  <br />
                </CardContent>

              }
              
            </Card>
            <DataGrid rows={rows} columns={columns} sx={{ mt: 2 }} getRowId={(row) => row.id} colorr onRowClick={params=> setSelectedRow(params.row)} />
          </>
      }
      <ConfirmDialog open={confirmOpen} message='This Appointment will be Canceled, ARE YOU SURE' 
        onCancel={()=> setConfirmOpen(false)} onConfirm={handleConfirmDelete}></ConfirmDialog>

        <Snackbar
          open={snackbar.open}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          autoHideDuration={1200}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
    </Container>
  );
}