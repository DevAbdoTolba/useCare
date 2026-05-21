import {
  Container,
  Stack,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { THEME_OPTIONS } from '../../theme/themes.js';
import { useThemeMode } from '../../theme/useThemeMode.js';

export default function SystemSettingsPage() {
  const { mode, setMode } = useThemeMode();

  return (
    <Container maxWidth="md">
      <Stack spacing={3} marginTop={4} marginBottom={6}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">System settings</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose the site theme. It applies to the whole app instantly and is
            remembered on this device.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {THEME_OPTIONS.map((opt) => {
            const active = opt.key === mode;
            return (
              <Card key={opt.key} variant="outlined">
                <CardActionArea onClick={() => setMode(opt.key)}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Stack spacing={0.5}>
                        <Typography variant="h6">{opt.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{opt.description}</Typography>
                      </Stack>
                      {active ? (
                        <Chip color="primary" icon={<CheckCircleIcon />} label="Active" />
                      ) : (
                        <Chip variant="outlined" label="Use this" />
                      )}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}
