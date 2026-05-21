import dayjs from 'dayjs';

/** First letter of a name for an Avatar, upper-cased. */
export const initialOf = (name) => (name?.trim()?.[0] ?? '?').toUpperCase();

/** Hour number (0..23) → "h A" label, e.g. 14 → "2 PM". */
export const hourLabel = (h) => dayjs().hour(h).minute(0).format('h A');

/** "HH:mm" → "h:mm A", e.g. "16:30" → "4:30 PM". */
export const timeLabel = (t) => dayjs(`2000-01-01 ${t}`).format('h:mm A');

/** Whole years between a date-of-birth (ISO) and today, or null. */
export const ageFromDob = (dob) => {
  if (!dob) return null;
  const years = dayjs().diff(dayjs(dob), 'year');
  return Number.isFinite(years) ? years : null;
};

/** MUI Chip color per appointment status. */
export const STATUS_COLOR = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'default',
  completed: 'info',
};
