import { Container, Typography, Button, TextField, Box, Card, CardContent, Snackbar } from '@mui/material';
import { listSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '../../api/specialties';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import FormDialog from '../../components/common/FormDialog';


export default function SpecialtiesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newData, setNewData] = useState({ name: '', description: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    listSpecialties().then(data => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <>
          <Button variant="outlined" onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button variant="outlined" onClick={() => handleDelete(params.row)}>Delete</Button>
          <Button variant="outlined" onClick={() => handleView(params.row)}>View</Button>
        </>
      ),
    },
  ];

  const handleDelete = (row) => {
    setSelectedRow(row);
    setConfirmOpen(true);
    setView(false);
    setEdit(false);
  };

  const handleView = (row) => {
    if (selectedRow?.id === row.id && view) {
      setView(false);
      setSelectedRow(null);
      setEdit(false);
    } else {
      setSelectedRow(row);
      setNewData({ name: row.name, description: row.description });
      setView(true);
      setEdit(false);
    }
  };

  const handleEdit = (row) => {
    if (selectedRow?.id === row.id && edit) {
      setEdit(false);
      setView(false);
      setSelectedRow(null);
    } else {
      setSelectedRow(row);
      setNewData({ name: row.name, description: row.description });
      setView(true);
      setEdit(true);
    }
  };

  const handleAddButton = () => {
    setAdd(true);
    setView(false);
    setEdit(false);
  };

  const handleAddingToField = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleConfirmDelete = () => {
    deleteSpecialty(selectedRow.id).then(() => {
      setRows(rows.filter(r => r.id !== selectedRow.id));
      setConfirmOpen(false);
      setSelectedRow(null);
      setSnackbar({ open: true, message: 'Deleted permanently' });
    }).catch((err) => console.log(err));
  };

  const handleConfirmAdd = () => {
    createSpecialty(newData).then((data) => {
      setRows([...rows, data]);
      setAdd(false);
      setNewData({ name: '', description: '' });
      setView(false);
      setSnackbar({ open: true, message: 'Added successfully' });
    }).catch((err) => console.log(err));
  };

  const handleConfirmEdit = () => {
    updateSpecialty(selectedRow.id, newData).then(() => {
      setRows(rows.map(r => r.id === selectedRow.id ? { ...r, ...newData } : r));
      setView(false);
      setEdit(false);
      setSelectedRow(null);
      setNewData({ name: '', description: '' });
      setSnackbar({ open: true, message: 'Edited successfully' });
    }).catch((err) => console.log(err));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={4}>Specialties</Typography>
      {loading ? <LoadingSpinner /> : (
        <div>
          {view && (
            <Card>
              <CardContent>
                {edit ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Name"
                      variant="outlined"
                      name="name"
                      value={newData.name}
                      onChange={handleAddingToField}
                    />
                    <TextField
                      label="Description"
                      variant="outlined"
                      name="description"
                      value={newData.description}
                      onChange={handleAddingToField}
                      multiline
                      rows={2}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" onClick={handleConfirmEdit}>Save</Button>
                      <Button onClick={() => { setEdit(false); setView(false); setSelectedRow(null); }}>Cancel</Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6">{selectedRow?.name}</Typography>
                    <br />
                    <Typography variant="body2">{selectedRow?.description}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          )}
          <br />
          <br />
          <Button variant="contained" onClick={handleAddButton}>Add Specialties</Button>
          {rows.length > 0 ? (
            <DataGrid rows={rows} columns={columns} sx={{ mt: 2 }} />
          ) : (
            <EmptyState message="No specialties found. Add one to get started." />
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        message={`Are you sure you want to delete "${selectedRow?.name}"?`}
      />

      <FormDialog
        open={add}
        onCancel={() => { setAdd(false); setNewData({ name: '', description: '' }); }}
        onConfirm={handleConfirmAdd}
        message={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" variant="filled" value={newData.name} name="name" onChange={handleAddingToField} />
            <TextField label="Description" variant="filled" value={newData.description} name="description" onChange={handleAddingToField} multiline rows={2} />
          </Box>
        }
      />

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        autoHideDuration={1200}
      />
    </Container>
  );
}
