import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

/**
 * Thin wrapper around the shared ConfirmDialog for "set day available".
 *
 * @param {{ open: boolean, date?: string, onConfirm: () => void, onCancel: () => void }} props
 */
export default function ConfirmAvailableDialog({ open, date, onConfirm, onCancel }) {
  // TODO: hook to api/availability.js -> setDayAvailable(doctorId, date)
  return (
    <ConfirmDialog
      open={open}
      title="Confirm availability"
      message={`Set ${date ?? 'this day'} as available for appointments?`}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel="Confirm"
      cancelLabel="Cancel"
    />
  );
}
