import {
  Stack,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material';
import { hourLabel } from '../../lib/format.js';

const GRID_ROWS = [0, 1, 2];
const GRID_COLS = 8; // 8 x 3 = 24 hours

/**
 * Shared 24-hour day grid (8 columns x 3 rows). Each page supplies:
 *  - getCell(hour) -> { selected?: bool, dim?: bool, chip?: ReactNode }
 *  - onHourClick(hour)
 * so the same grid powers both the patient appointments view and the doctor
 * availability view.
 */
export default function DayHourGrid({ selectedDay, getCell, onHourClick, caption }) {
  return (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.secondary">
        {selectedDay.format('dddd, MMM D, YYYY')}{caption ? ` · ${caption}` : ''}
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
            {GRID_ROWS.map((row) => (
              <TableRow key={row}>
                {Array.from({ length: GRID_COLS }, (_, col) => {
                  const hour = row * GRID_COLS + col;
                  const cell = getCell(hour) || {};
                  return (
                    <TableCell
                      key={hour}
                      align="center"
                      onClick={onHourClick ? () => onHourClick(hour) : undefined}
                      selected={Boolean(cell.selected)}
                    >
                      <Stack spacing={0.5} alignItems="center">
                        <Typography variant="caption" color={cell.dim ? 'text.disabled' : 'text.secondary'}>
                          {hourLabel(hour)}
                        </Typography>
                        {cell.chip ?? null}
                      </Stack>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
