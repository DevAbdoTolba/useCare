import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

/**
 * @param {{ open: boolean, onClose: () => void, user?: import('../../schema/schema.js').User }} props
 */
export default function ApproveUserDialog({ open, onClose /*, user */ }) {
  // TODO: implement per wireframe (docs/useCare.excalidraw).
  // Show Name / Role / Desc. Approve and Reject buttons call api/users.js.
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Approve user</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">TODO: implement.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
