import { setDayAvailable } from '../../api/availability.js';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

/**
 * Thin wrapper around the shared ConfirmDialog for "set day available".
 *
 * @param {{ open: boolean, date?: string, onConfirm: () => void, onCancel: () => void }} props
 */
export default function ConfirmAvailableDialog({ open, date, onConfirm, onCancel }) {
  const handleConfirm = async () => {
    try {
      await setDayAvailable(2, date); // Hardcoded doctor ID 2 for now
      onConfirm();
    } catch (err) {
      console.error('Failed to set availability', err);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Confirm availability"
      message={`Set ${date ?? 'this day'} as available for appointments?`}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      confirmLabel="Confirm"
      cancelLabel="Cancel"
    />
  );
}
