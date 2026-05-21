import { createTheme } from '@mui/material/styles';

/**
 * Three site-wide themes, selectable from the admin Settings page.
 * Everything is expressed as MUI theme config (palette / shape / typography /
 * component styleOverrides) so the WHOLE app re-skins without touching any
 * component. Every surface, input, chip, alert, snackbar, table border and even
 * the click ripple follows the chosen philosophy.
 */

/* ------------------------------------------------------------------ */
/* 1) DEFAULT — plain Material, no frills.                            */
/* ------------------------------------------------------------------ */
const defaultTheme = createTheme();

/* ------------------------------------------------------------------ */
/* 2) GLASS — Apple "Liquid Glass": calm neutral backdrop, frosted     */
/*    near-white panels, specular rims, soft sheen, big radii.        */
/* ------------------------------------------------------------------ */
const G_BLUR = 'blur(30px) saturate(160%)';
const G_BLUR_SM = 'blur(12px) saturate(160%)';
const G_PANEL = 'rgba(255, 255, 255, 0.55)';
const G_RIM = '1px solid rgba(255, 255, 255, 0.7)';
const G_LINE = 'rgba(60, 60, 67, 0.18)';        // hairline separators
const G_SHADOW = '0 10px 30px rgba(17, 24, 39, 0.10), inset 0 1px 1px rgba(255, 255, 255, 0.9)';
const G_SHEEN = 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 100%)';

const glassTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0a84ff' },
    secondary: { main: '#5e5ce6' },
    success: { main: '#30d158' },
    warning: { main: '#ff9f0a' },
    error: { main: '#ff453a' },
    info: { main: '#64d2ff' },
    background: { default: '#e9eef5', paper: G_PANEL },
    text: { primary: '#1c1c1e', secondary: '#48484a' },
    divider: G_LINE,
  },
  shape: { borderRadius: 22 },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          background: 'radial-gradient(125% 125% at 50% 0%, #ffffff 0%, #eef2f8 45%, #e2e8f1 100%)',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: G_PANEL,
          backdropFilter: G_BLUR,
          WebkitBackdropFilter: G_BLUR,
          borderBottom: G_RIM,
          boxShadow: 'none',
          color: '#1c1c1e',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: G_PANEL,
          backdropFilter: G_BLUR,
          WebkitBackdropFilter: G_BLUR,
          border: G_RIM,
          boxShadow: G_SHADOW,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backgroundImage: G_SHEEN,
          backdropFilter: G_BLUR,
          WebkitBackdropFilter: G_BLUR,
          border: G_RIM,
          boxShadow: G_SHADOW,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: G_BLUR,
          WebkitBackdropFilter: G_BLUR,
          border: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999 },
        outlined: { borderColor: 'rgba(60, 60, 67, 0.28)' },
        containedPrimary: { boxShadow: '0 4px 14px rgba(10, 132, 255, 0.35)' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          borderColor: 'rgba(60, 60, 67, 0.2)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(10, 132, 255, 0.16)',
            color: '#0a84ff',
            '&:hover': { backgroundColor: 'rgba(10, 132, 255, 0.24)' },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: G_BLUR_SM,
          WebkitBackdropFilter: G_BLUR_SM,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: G_LINE },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(60, 60, 67, 0.35)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0a84ff', borderWidth: 1 },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: G_BLUR_SM,
          WebkitBackdropFilter: G_BLUR_SM,
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.6)' },
          '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.7)' },
          '&::before, &::after': { display: 'none' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { color: '#48484a', '&.Mui-focused': { color: '#0a84ff' } } },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 500 },
        colorDefault: {
          backgroundColor: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: G_BLUR_SM,
          WebkitBackdropFilter: G_BLUR_SM,
          border: '1px solid rgba(255, 255, 255, 0.7)',
        },
        outlined: { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderColor: 'rgba(60, 60, 67, 0.25)' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.6)',
          backdropFilter: G_BLUR_SM,
          WebkitBackdropFilter: G_BLUR_SM,
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'rgba(28, 28, 30, 0.7)',
          backdropFilter: G_BLUR,
          WebkitBackdropFilter: G_BLUR,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 10,
          backgroundColor: 'rgba(28, 28, 30, 0.78)',
          backdropFilter: G_BLUR_SM,
          WebkitBackdropFilter: G_BLUR_SM,
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: G_LINE } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: G_LINE },
        head: { fontWeight: 600, backgroundColor: 'transparent' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: 'rgba(10, 132, 255, 0.14)' },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-selected': {
            backgroundColor: 'rgba(10, 132, 255, 0.14)',
            '&:hover': { backgroundColor: 'rgba(10, 132, 255, 0.2)' },
          },
        },
      },
    },
    MuiTouchRipple: {
      styleOverrides: { child: { backgroundColor: 'rgba(10, 132, 255, 0.4)' } },
    },
  },
});

/* ------------------------------------------------------------------ */
/* 3) VINTAGE — warm serif legacy: cream paper, coffee tones, squared  */
/*    corners, hairline borders, no glossy shadows.                   */
/* ------------------------------------------------------------------ */
const V_BORDER = '1px solid #c9b89a';
const V_LINE = '#e0d4ba';
const V_PAPER = '#fbf7ec';
const V_INK = '#3b2f2f';

const vintageTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6f4e37' },     // coffee
    secondary: { main: '#8c7851' },   // olive-tan
    success: { main: '#6b8e23' },     // olive
    warning: { main: '#b8860b' },     // dark goldenrod
    error: { main: '#a33a2a' },       // brick
    info: { main: '#5b7b8a' },        // slate
    background: { default: '#f5efe1', paper: V_PAPER },
    text: { primary: V_INK, secondary: '#6b5d4f' },
    divider: V_LINE,
  },
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: 'Georgia, "Iowan Old Style", "Times New Roman", serif',
    h1: { letterSpacing: '0.02em' },
    h2: { letterSpacing: '0.02em' },
    button: { textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: '#f5efe1' } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#6f4e37',
          color: '#f5efe1',
          boxShadow: 'none',
          borderBottom: '3px double #d9cbb3',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: V_PAPER, border: V_BORDER, boxShadow: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundColor: V_PAPER, border: V_BORDER, boxShadow: 'none' },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: V_PAPER, borderRight: V_BORDER } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 2 },
        outlined: { borderColor: '#b89f7a' },
        contained: { boxShadow: 'none' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          borderColor: '#c9b89a',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          '&.Mui-selected': {
            backgroundColor: 'rgba(111, 78, 55, 0.14)',
            color: '#6f4e37',
            '&:hover': { backgroundColor: 'rgba(111, 78, 55, 0.2)' },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          backgroundColor: '#fffdf7',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#c9b89a' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#a98e6a' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6f4e37', borderWidth: 1 },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          backgroundColor: '#f3ead7',
          '&:hover': { backgroundColor: '#efe3cc' },
          '&.Mui-focused': { backgroundColor: '#efe3cc' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { color: '#6b5d4f', '&.Mui-focused': { color: '#6f4e37' } } },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 2, fontWeight: 600 },
        colorDefault: { backgroundColor: '#efe6d2', border: V_BORDER },
        outlined: { backgroundColor: 'transparent', borderColor: '#c9b89a' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 2, border: '1px solid currentColor' },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: { borderRadius: 2, backgroundColor: '#3b2f2f', color: '#f5efe1' },
      },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { borderRadius: 2, backgroundColor: '#3b2f2f', fontFamily: 'Georgia, serif' } },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: V_LINE } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: V_LINE },
        head: { fontWeight: 700, backgroundColor: '#f0e8d6', color: V_INK },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(111, 78, 55, 0.06)' },
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: 'rgba(111, 78, 55, 0.12)' },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          '&.Mui-selected': {
            backgroundColor: 'rgba(111, 78, 55, 0.12)',
            '&:hover': { backgroundColor: 'rgba(111, 78, 55, 0.18)' },
          },
        },
      },
    },
    MuiTouchRipple: {
      styleOverrides: { child: { backgroundColor: 'rgba(111, 78, 55, 0.45)' } },
    },
  },
});

export const DEFAULT_THEME_KEY = 'default';

export const THEMES = {
  default: defaultTheme,
  glass: glassTheme,
  vintage: vintageTheme,
};

export const THEME_OPTIONS = [
  { key: 'default', label: 'Classic', description: 'The standard, no-frills Material look.' },
  { key: 'glass', label: 'Liquid Glass — Apple style', description: 'Frosted, translucent surfaces with specular rims over a calm neutral backdrop.' },
  { key: 'vintage', label: 'Vintage', description: 'Warm, serif, clean legacy aesthetic with coffee tones.' },
];
