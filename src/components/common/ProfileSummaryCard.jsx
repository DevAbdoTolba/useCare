import { Card, CardContent, Stack, Avatar, Typography } from '@mui/material';
import EmptyState from './EmptyState.jsx';
import { initialOf } from '../../lib/format.js';

/**
 * Small "who am I" card: avatar + name + email, plus any extra lines/chips
 * passed as children. Shared by the patient and doctor day views.
 */
export default function ProfileSummaryCard({ user, children }) {
  return (
    <Card variant="outlined">
      <CardContent>
        {user ? (
          <Stack spacing={2} alignItems="center">
            <Avatar>{initialOf(user.name)}</Avatar>
            <Typography variant="h6">{user.name}</Typography>
            <Stack spacing={0.5} alignItems="center">
              {user.email && (
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              )}
              {children}
            </Stack>
          </Stack>
        ) : (
          <EmptyState title="Not signed in" />
        )}
      </CardContent>
    </Card>
  );
}
