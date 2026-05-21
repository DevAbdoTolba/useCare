import { Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

// White badge with a dashed primary-colored ring, so the count never blends
// into the selected-day color. Themed via the palette.
const CountBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    border: `1px dashed ${theme.palette.primary.main}`,
    fontWeight: 700,
  },
}));

/** Calendar day with a count badge for that day's appointments. */
function ApptBadgeDay({ countsByDate = {}, day, outsideCurrentMonth, ...other }) {
  const count = outsideCurrentMonth ? 0 : (countsByDate[day.format('YYYY-MM-DD')] || 0);
  return (
    <CountBadge overlap="circular" badgeContent={count || undefined}>
      <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} />
    </CountBadge>
  );
}

/**
 * Day-picker calendar that shows a count badge on each day with appointments.
 * Shared by the doctor and patient day views.
 *
 * @param {object} props
 * @param {import('dayjs').Dayjs} props.value
 * @param {(d: import('dayjs').Dayjs) => void} props.onChange
 * @param {Record<string, number>} props.countsByDate - 'YYYY-MM-DD' -> count
 */
export default function AppointmentCalendar({ value, onChange, countsByDate = {} }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={onChange}
        slots={{ day: ApptBadgeDay }}
        slotProps={{ day: { countsByDate } }}
      />
    </LocalizationProvider>
  );
}
