import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Stack,
  Typography,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
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
import { listPendingSuggestions, setSuggestionStatus } from '../../lib/specialtySuggestionsStore.js';
import MasterDetailBrowser from '../../components/common/MasterDetailBrowser.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const EMPTY = { name: '', description: '' };

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('specialties'); // 'specialties' | 'suggestions'
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
    Promise.all([listSpecialties(), listPendingSuggestions()])
      .then(([specs, sugg]) => {
        if (!mounted) return;
        setSpecialties(Array.isArray(specs) ? specs : []);
        setSuggestions(Array.isArray(sugg) ? sugg : []);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  async function refreshLists() {
    const [specs, sugg] = await Promise.all([listSpecialties(), listPendingSuggestions()]);
    setSpecialties(Array.isArray(specs) ? specs : []);
    setSuggestions(Array.isArray(sugg) ? sugg : []);
  }

  function changeView(next) {
    setView(next);
    setSelectedId(null);
    setEditing(false);
    setSearch('');
  }

  async function approveSuggestion(s) {
    await setSuggestionStatus(s.id, 'approved'); // backend creates the real Specialty
    await refreshLists();
    setSelectedId(null);
    setToast(`"${s.name}" approved and added.`);
  }

  async function rejectSuggestion(s) {
    await setSuggestionStatus(s.id, 'rejected');
    setSuggestions((prev) => prev.filter((x) => x.id !== s.id));
    setSelectedId(null);
    setToast(`"${s.name}" rejected.`);
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

  const isSuggestions = view === 'suggestions';
  const source = isSuggestions ? suggestions : specialties;

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return source.filter((s) => !term || s.name?.toLowerCase().includes(term));
  }, [source, search]);

  const selected = source.find((s) => s.id === selectedId) ?? null;

  if (loading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner />
      </Container>
    );
  }

  const columns = isSuggestions
    ? [
        { key: 'name', label: 'Suggested specialty' },
        { key: 'proposed_by', label: 'Proposed by', render: (s) => s.proposed_by || 'a doctor' },
      ]
    : [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
      ];

  const renderSuggestion = (s) => (
    <Stack spacing={2}>
      <Typography variant="h6">{s.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        Proposed by {s.proposed_by || 'a doctor'}. Approving creates it as a real specialty.
      </Typography>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button color="warning" onClick={() => rejectSuggestion(s)}>Reject</Button>
        <Button variant="contained" disableElevation onClick={() => approveSuggestion(s)}>Approve</Button>
      </Stack>
    </Stack>
  );

  const renderSpecialty = (s) =>
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
    );

  return (
    <>
      <MasterDetailBrowser
        title="Specialties"
        placeholderTitle={isSuggestions ? 'No suggestion selected' : 'No specialty selected'}
        placeholderMessage={
          isSuggestions
            ? 'Pick a suggestion to review, then approve or reject it.'
            : 'Pick a specialty from the table below, or add a new one.'
        }
        selected={selected}
        selectedId={selectedId}
        onSelectRow={(s) => { setSelectedId(s ? s.id : null); setEditing(false); }}
        renderDetail={isSuggestions ? renderSuggestion : renderSpecialty}
        columns={columns}
        rows={rows}
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel={isSuggestions ? 'Search suggestions' : 'Search specialties'}
        emptyMessage={isSuggestions ? 'No pending suggestions' : 'No specialties yet'}
        filters={(
          <ToggleButtonGroup
            exclusive
            color="primary"
            value={view}
            onChange={(_e, v) => v && changeView(v)}
          >
            <ToggleButton value="specialties">Specialties</ToggleButton>
            <ToggleButton value="suggestions">
              Suggestions{suggestions.length > 0 ? ` (${suggestions.length})` : ''}
            </ToggleButton>
          </ToggleButtonGroup>
        )}
        actions={!isSuggestions && (
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
