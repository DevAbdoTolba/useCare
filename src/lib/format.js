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
  unpaid: 'default', // booked but not paid yet — waiting for the patient to pay
  pending: 'warning', // paid, waiting for the doctor to confirm
  confirmed: 'success',
  cancelled: 'default',
  completed: 'info',
  outdated: 'error',
};

/** The payment-aware status to show: 'unpaid' before payment, else the real one. */
export const shownStatus = (a) => a?.display_status ?? a?.status;

/** MUI Chip color per user account status. */
export const USER_STATUS_COLOR = {
  pending: 'warning',
  approved: 'success',
  rejected: 'default',
  banned: 'error',
};
