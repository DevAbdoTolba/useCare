import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Stack,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  listSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} from '../../api/specialties.js';
import MasterDetailBrowser from '../../components/common/MasterDetailBrowser.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const EMPTY = { name: '', description: '' };

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let mounted = true;
    listSpecialties()
      .then((data) => { if (mounted) setSpecialties(Array.isArray(data) ? data : []); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return specialties.filter((s) => !term || s.name?.toLowerCase().includes(term));
  }, [specialties, search]);

  const selected = specialties.find((s) => s.id === selectedId) ?? null;

  function selectRow(s) {
    setSelectedId(s ? s.id : null);
    setEditing(false);
  }

  async function handleAdd() {
    const created = await createSpecialty(addForm);
    setSpecialties((prev) => [...prev, created]);
    setAddOpen(false);
    setAddForm(EMPTY);
    setToast('Specialty added.');
  }

  async function handleSaveEdit() {
    await updateSpecialty(selectedId, editForm);
    setSpecialties((prev) => prev.map((s) => (s.id === selectedId ? { ...s, ...editForm } : s)));
    setEditing(false);
    setToast('Specialty updated.');
  }

  async function handleDelete() {
    await deleteSpecialty(selectedId);
    setSpecialties((prev) => prev.filter((s) => s.id !== selectedId));
    setConfirmDelete(false);
    setSelectedId(null);
    setToast('Specialty deleted.');
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
  ];

  const renderDetail = (s) => (
    editing ? (
      <Stack spacing={2}>
        <TextField label="Name" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
        <TextField label="Description" value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} fullWidth multiline minRows={2} />
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={() => setEditing(false)}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={handleSaveEdit}>Save</Button>
        </Stack>
      </Stack>
    ) : (
      <Stack spacing={2}>
        <Typography variant="h6">{s.name}</Typography>
        <Typography variant="body2" color="text.secondary">{s.description || 'No description.'}</Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button color="error" onClick={() => setConfirmDelete(true)}>Delete</Button>
          <Button variant="outlined" onClick={() => { setEditForm({ name: s.name, description: s.description ?? '' }); setEditing(true); }}>Edit</Button>
        </Stack>
      </Stack>
    )
  );

  return (
    <>
      <MasterDetailBrowser
        title="Specialties"
        placeholderTitle="No specialty selected"
        placeholderMessage="Pick a specialty from the table below, or add a new one."
        selected={selected}
        selectedId={selectedId}
        onSelectRow={selectRow}
        renderDetail={renderDetail}
        columns={columns}
        rows={rows}
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="Search specialties"
        emptyMessage="No specialties yet"
        actions={(
          <Button variant="contained" disableElevation startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
            Add
          </Button>
        )}
      />

      {/* Add dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add specialty</DialogTitle>
        <DialogContent>
          <Stack spacing={2} marginTop={1}>
            <TextField label="Name" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
            <TextField label="Description" value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} fullWidth multiline minRows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={handleAdd} disabled={!addForm.name.trim()}>Add</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete specialty"
        message={`Delete "${selected?.name}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </>
  );
}
