import { Container, Typography , Button} from '@mui/material';
import { listSpecialties , createSpecialty , updateSpecialty , deleteSpecialty } from '../../api/specialties';
import LoadingSpinner  from '../../components/common/LoadingSpinner'; 
import  EmptyState from '../../components/common/EmptyState'; 
import ConfirmDialog  from '../../components/common/ConfirmDialog'; 
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

export default function SpecialtiesPage() {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // CRUD: list specialties, add, edit, delete (with ConfirmDialog).
  const [rows , setRows] = useState([]);
  const [loading , setLoading] = useState(true);
  const [selectedRow , setSelectedRow] = useState(null);
  const [confirmOpen , setConfirmOpen] = useState(false);
  
  useEffect(()=>{
    listSpecialties().then(data=>{
      setRows(data);
      setLoading(false);
    })
    }
    ,[])

  const columns = [ 
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'description', headerName: 'Description', width: 200 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (params) => (
      <>
        <Button variant="outlined" onClick={() => handleEdit(params.row)} >Edit</Button>
        <Button variant="outlined" onClick={() => handleDelete(params.row)} >Delete</Button>
      </>
    ),
  },
  ];

  const handleDelete = (row) => {
    setSelectedRow(row);
    setConfirmOpen(true);
  }

  const handleEdit = (row) => {
    selectedRow(row);
  }

  const handleConfirmDelete = () => {
    deleteSpecialty(selectedRow.id).then(() => {
      setRows(rows.filter(r => r.id !== selectedRow.id ));
      setConfirmOpen(false);
      setSelectedRow(null);
    }).catch((err)=> console.log(err));
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Specialties</Typography>
      {
        loading ? <LoadingSpinner/> : (
        <div>
          <DataGrid rows={rows} columns={columns}></DataGrid>
        </div>
      )}
      
      <ConfirmDialog 
        open={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={()=> setConfirmOpen(false)}
        message={`Are you sure you want to delete "${selectedRow?.name}"?`}
      />

    </Container>
  );
}
