import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
} from '@mui/material';
import EmptyState from './EmptyState.jsx';

const PAGE_OPTIONS = [5, 10, 25];

/**
 * The "/patient"-style master-detail pattern, reusable:
 *  - a viewer Card on top (placeholder until a row is picked, then renderDetail)
 *  - a toolbar: search field + optional `filters` + optional `actions`
 *  - a paginated table whose row click selects a record
 *
 * Props:
 *  - title, placeholderTitle, placeholderMessage
 *  - selected, selectedId, onSelectRow, renderDetail(selected)
 *  - columns: [{ key, label, align?, render?(row) }]
 *  - rows (already filtered by the parent), getRowId
 *  - searchValue, onSearchChange, searchLabel
 *  - filters, actions  (extra toolbar nodes)
 *  - emptyMessage
 */
export default function MasterDetailBrowser({
  title,
  placeholderTitle = 'Nothing selected',
  placeholderMessage,
  selected,
  selectedId,
  onSelectRow,
  renderDetail,
  columns,
  rows,
  getRowId = (r) => r.id,
  searchValue,
  onSearchChange,
  searchLabel = 'Search',
  filters,
  actions,
  emptyMessage = 'No results.',
}) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(PAGE_OPTIONS[0]);

  // Reset to the first page whenever the filtered set or page size changes.
  // Keying on the `rows` reference (a fresh array per filter change) catches
  // every filter — not just ones that change the row count.
  useEffect(() => { setPage(0); }, [rows, perPage]);

  // Drop the selection if the current filter hides the selected row.
  useEffect(() => {
    if (selectedId != null && !rows.some((r) => getRowId(r) === selectedId)) {
      onSelectRow(null);
    }
  }, [rows, selectedId, getRowId, onSelectRow]);

  const paged = useMemo(
    () => rows.slice(page * perPage, page * perPage + perPage),
    [rows, page, perPage],
  );

  return (
    <Container maxWidth="lg">
      <Stack spacing={3} marginTop={2} marginBottom={6}>
        <Typography variant="h4" component="h1">{title}</Typography>

        {/* Viewer card */}
        <Card variant="outlined">
          <CardContent>
            {selected ? renderDetail(selected) : (
              <EmptyState title={placeholderTitle} message={placeholderMessage} />
            )}
          </CardContent>
        </Card>

        {/* Toolbar: search + filters + actions */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField
            label={searchLabel}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
          />
          {filters}
          {actions}
        </Stack>

        {/* Table */}
        {rows.length === 0 ? (
          <EmptyState title={emptyMessage} />
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((c) => (
                    <TableCell key={c.key} align={c.align}>{c.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    hover
                    selected={selectedId === getRowId(row)}
                    onClick={() => onSelectRow(row)}
                  >
                    {columns.map((c) => (
                      <TableCell key={c.key} align={c.align}>
                        {c.render ? c.render(row) : row[c.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={(_e, p) => setPage(p)}
              rowsPerPage={perPage}
              onRowsPerPageChange={(e) => { setPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={PAGE_OPTIONS}
            />
          </TableContainer>
        )}
      </Stack>
    </Container>
  );
}
