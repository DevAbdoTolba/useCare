import { useState } from 'react';
import {
  Stack,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB — keeps base64 data URLs inside localStorage limits
const ACCEPT = '.pdf,image/*';
const URL_PATTERN = /^https?:\/\/.+/i;

const isDataUrl = (v) => typeof v === 'string' && v.startsWith('data:');

/** True when a stored document value is usable: a link or an uploaded file. */
export const isDocValue = (v) => URL_PATTERN.test(v || '') || isDataUrl(v);

/**
 * A document source that can be EITHER a link or an uploaded file. With no
 * backend, "upload" reads the file into a base64 data URL — it persists in
 * localStorage and opens in a new tab just like a link. The value is always a
 * single string (http(s) URL or data: URL), so it drops straight into the
 * existing resume_url / license_url fields.
 */
export default function DocumentInput({ label, value, onChange, error, helperText }) {
  const [mode, setMode] = useState(isDataUrl(value) ? 'upload' : 'link');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');
    if (file.size > MAX_BYTES) {
      setFileError('File too large (max 3 MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setFileName(file.name); onChange(reader.result); };
    reader.onerror = () => setFileError('Could not read that file.');
    reader.readAsDataURL(file);
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap" useFlexGap>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={mode}
          onChange={(_e, next) => {
            if (!next) return;
            setMode(next);
            setFileError('');
            setFileName('');
            onChange('');
          }}
        >
          <ToggleButton value="link">Link</ToggleButton>
          <ToggleButton value="upload">Upload</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {mode === 'link' ? (
        <TextField
          label={`${label} link`}
          placeholder="https://…"
          value={isDataUrl(value) ? '' : (value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          error={error}
          helperText={helperText}
        />
      ) : (
        <Stack spacing={0.5}>
          <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
            {fileName || (isDataUrl(value) ? 'File attached — choose another' : 'Choose file (PDF or image)')}
            <input type="file" accept={ACCEPT} hidden onChange={handleFile} />
          </Button>
          {(fileError || helperText) && (
            <Typography variant="caption" color={fileError || error ? 'error' : 'text.secondary'}>
              {fileError || helperText}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
}
