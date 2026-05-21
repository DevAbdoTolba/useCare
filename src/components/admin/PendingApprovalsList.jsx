import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import EmptyState from '../common/EmptyState.jsx';
import { initialOf } from '../../lib/format.js';

/** The "recent pending approvals" list shown on the admin dashboard. */
export default function PendingApprovalsList({ users, onViewAll }) {
  return (
    <Box marginTop={2}>
      <Typography variant="h6" gutterBottom>Recent pending approvals</Typography>
      {users.length === 0 ? (
        <EmptyState title="No pending approvals" />
      ) : (
        <>
          <List>
            {users.slice(0, 5).map((u) => (
              <ListItem key={u.id} disablePadding>
                <ListItemAvatar>
                  <Avatar>{initialOf(u.name)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={u.name || u.email || `User ${u.id}`}
                  secondary={u.email ? `${u.email} · ${u.role || ''}`.trim() : (u.role || '')}
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box marginTop={1}>
            <Button variant="outlined" onClick={onViewAll}>View all pending users</Button>
          </Box>
        </>
      )}
    </Box>
  );
}
