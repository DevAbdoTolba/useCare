import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

/**
 * A single dashboard stat: a big value over a label. Pass `onClick` to make
 * the whole card a clickable action area.
 */
export default function StatCard({ value, label, onClick }) {
  const content = (
    <CardContent>
      <Typography variant="h5">{value}</Typography>
      <Typography color="text.secondary">{label}</Typography>
    </CardContent>
  );

  return (
    <Card variant="outlined">
      {onClick ? <CardActionArea onClick={onClick}>{content}</CardActionArea> : content}
    </Card>
  );
}
