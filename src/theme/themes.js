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

/* ------------------------------------------------------------------ */
/* 4) AI SLOP — every trending generative-AI landing-page cliché at    */
/*    once: dark indigo void, neon violet→pink→cyan gradients, glowing  */
/*    pill buttons, glassy gradient-rim cards, radii cranked to absurd. */
/* ------------------------------------------------------------------ */
const SLOP_GRAD = 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #22d3ee 100%)';
const SLOP_GLOW = '0 0 24px rgba(139, 92, 246, 0.55), 0 0 48px rgba(236, 72, 153, 0.35)';
const SLOP_PANEL = 'rgba(30, 27, 64, 0.55)';
const SLOP_RIM = '1px solid rgba(168, 139, 250, 0.45)';
const SLOP_BLUR = 'blur(18px) saturate(160%)';

const aiSlopTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#a78bfa' },
    secondary: { main: '#f472b6' },
    success: { main: '#34d399' },
    warning: { main: '#fbbf24' },
    error: { main: '#fb7185' },
    info: { main: '#22d3ee' },
    background: { default: '#0b0a1f', paper: SLOP_PANEL },
    text: { primary: '#ECECFF', secondary: '#b6b2e0' },
    divider: 'rgba(168, 139, 250, 0.25)',
  },
  shape: { borderRadius: 28 },
  typography: {
    fontFamily: '"Poppins", "Inter", "Segoe UI", system-ui, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          color: '#ECECFF',
          background:
            'radial-gradient(900px 600px at 12% -10%, rgba(139,92,246,0.45) 0%, rgba(139,92,246,0) 60%),' +
            'radial-gradient(800px 600px at 110% 10%, rgba(236,72,153,0.40) 0%, rgba(236,72,153,0) 55%),' +
            'radial-gradient(900px 700px at 50% 120%, rgba(34,211,238,0.35) 0%, rgba(34,211,238,0) 60%),' +
            'linear-gradient(160deg, #0b0a1f 0%, #15123a 100%)',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          // White-bg video over a dark page: invert white->black, then screen it out.
          '--landing-video-blend': 'screen',
          '--landing-video-filter': 'invert(1) hue-rotate(180deg) saturate(1.4)',
          '--heart-title-glow-strong': 'rgba(139, 92, 246, 0.45)',
          '--heart-title-glow-soft': 'rgba(236, 72, 153, 0.25)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: SLOP_PANEL,
          backdropFilter: SLOP_BLUR,
          WebkitBackdropFilter: SLOP_BLUR,
          borderBottom: SLOP_RIM,
          boxShadow: SLOP_GLOW,
          color: '#ECECFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: SLOP_PANEL,
          backdropFilter: SLOP_BLUR,
          WebkitBackdropFilter: SLOP_BLUR,
          border: SLOP_RIM,
          boxShadow: SLOP_GLOW,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: SLOP_PANEL,
          backgroundImage: 'linear-gradient(160deg, rgba(168,139,250,0.18) 0%, rgba(236,72,153,0.10) 100%)',
          backdropFilter: SLOP_BLUR,
          WebkitBackdropFilter: SLOP_BLUR,
          border: SLOP_RIM,
          boxShadow: SLOP_GLOW,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: 'rgba(21, 18, 58, 0.75)', backdropFilter: SLOP_BLUR, WebkitBackdropFilter: SLOP_BLUR, border: 'none' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 700 },
        containedPrimary: {
          backgroundImage: SLOP_GRAD,
          color: '#fff',
          boxShadow: SLOP_GLOW,
          '&:hover': { backgroundImage: SLOP_GRAD, filter: 'brightness(1.08)', boxShadow: SLOP_GLOW },
        },
        outlined: { borderColor: 'rgba(168, 139, 250, 0.6)', color: '#d6ccff' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          color: '#cfc8ff',
          borderColor: 'rgba(168, 139, 250, 0.4)',
          '&.Mui-selected': {
            color: '#fff',
            backgroundImage: SLOP_GRAD,
            '&:hover': { backgroundImage: SLOP_GRAD, filter: 'brightness(1.08)' },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'rgba(30, 27, 64, 0.5)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(168, 139, 250, 0.4)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(168, 139, 250, 0.7)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#22d3ee', borderWidth: 2 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { color: '#b6b2e0', '&.Mui-focused': { color: '#22d3ee' } } } },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 700 },
        colorDefault: { backgroundImage: SLOP_GRAD, color: '#fff', border: 'none' },
        outlined: { borderColor: 'rgba(168,139,250,0.5)', color: '#d6ccff' },
      },
    },
    MuiAlert: { styleOverrides: { root: { borderRadius: 18, border: SLOP_RIM, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' } } },
    MuiSnackbarContent: { styleOverrides: { root: { borderRadius: 18, backgroundImage: SLOP_GRAD, color: '#fff' } } },
    MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 12, backgroundColor: 'rgba(21,18,58,0.92)', border: SLOP_RIM } } },
    MuiDivider: { styleOverrides: { root: { borderColor: 'rgba(168,139,250,0.25)' } } },
    MuiTableCell: { styleOverrides: { root: { borderColor: 'rgba(168,139,250,0.2)' }, head: { fontWeight: 700, color: '#d6ccff', backgroundColor: 'transparent' } } },
    MuiTableRow: { styleOverrides: { root: { '&:hover': { backgroundColor: 'rgba(168,139,250,0.1)' }, '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: 'rgba(236,72,153,0.16)' } } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 14, '&.Mui-selected': { backgroundImage: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))', '&:hover': { backgroundImage: 'linear-gradient(90deg, rgba(139,92,246,0.4), rgba(236,72,153,0.3))' } } } } },
    MuiTouchRipple: { styleOverrides: { child: { backgroundColor: 'rgba(236,72,153,0.5)' } } },
  },
});

/* ------------------------------------------------------------------ */
/* 5) XP VISTA — early-2000s Windows nostalgia: Luna-blue glossy title  */
/*    bars, the silver window face (#ECE9D8), Tahoma, beveled glossy     */
/*    buttons, the green Start-button for primary, squared 3px corners. */
/* ------------------------------------------------------------------ */
// Fonts per the Luna spec: Tahoma body, Trebuchet MS title bars, Franklin
// Gothic headings.
const XP_BODY_FONT = 'Tahoma, "Segoe UI", Geneva, Verdana, sans-serif';
const XP_TITLE_FONT = '"Trebuchet MS", Tahoma, sans-serif';
const XP_HEAD_FONT = '"Franklin Gothic Medium", "Arial Narrow", Tahoma, sans-serif';

const XP_BLUE = '#0a51c5';
const XP_FACE = '#ece9d8';   // the classic silver/beige control + desktop face
const XP_LINE = '#919b9c';   // sunken control border grey

// Soft-plastic vertical "gel": a bright top half, a crisp highlight->shade step
// across the midline, then a gentle lift at the bottom. THIS is the XP look —
// not a single flat gradient. The bevel + drop shadow below sell the 3D.
const xpGel = (a, b, c, d) => `linear-gradient(180deg, ${a} 0%, ${b} 49%, ${c} 51%, ${d} 100%)`;
const XP_TITLE_GEL = 'linear-gradient(180deg,#4596f5 0%,#1d6ae0 8%,#0a51c5 46%,#0a4bbf 54%,#1f63d6 92%,#4596f5 100%)';
const XP_BTN_GEL = xpGel('#ffffff', '#f4f3ec', '#eae8da', '#f1efe3');
const XP_BTN_GEL_HOVER = xpGel('#ffffff', '#fbf6e6', '#f3edd6', '#f8f4e6');
// 3D tactile button: white top/left bevel, soft bottom/right shade, 135° drop shadow.
const XP_BEVEL = 'inset 1px 1px 0 rgba(255,255,255,0.95), inset -1px -1px 0 rgba(0,0,0,0.14), 1px 1px 2px rgba(0,0,0,0.28)';
const XP_BEVEL_PRESSED = 'inset 1px 1px 3px rgba(0,0,0,0.35)';
const XP_WINDOW_SHADOW = '2px 3px 7px rgba(0,0,0,0.30)';   // 135° window drop shadow
const XP_SUNKEN = 'inset 1px 1px 2px rgba(0,0,0,0.16)';    // recessed inputs
const XP_TEXT_SHADOW = '0 1px 1px rgba(0,0,0,0.45)';        // white-on-gel legibility

// Colour-coded gel action buttons (XP "navigational signage"): blue=neutral,
// green=go/start, red=destructive/close, yellow=log-off.
const xpAction = (gel, gelHover, border) => ({
  backgroundImage: gel,
  color: '#ffffff',
  border: `1px solid ${border}`,
  textShadow: XP_TEXT_SHADOW,
  boxShadow: XP_BEVEL,
  '&:hover': { backgroundImage: gelHover, boxShadow: `${XP_BEVEL}, 0 0 4px 1px rgba(255,255,255,0.35)` },
  '&:active': { boxShadow: XP_BEVEL_PRESSED },
});

const xpVistaTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: XP_BLUE },
    secondary: { main: '#4e9e2e' },
    success: { main: '#3c8a2c' },
    warning: { main: '#e0a200' },
    error: { main: '#c1272d' },
    info: { main: '#1d6ae0' },
    background: { default: XP_FACE, paper: '#ffffff' },
    text: { primary: '#1b2a44', secondary: '#4a5a72' },
    divider: '#c4c2b4',
  },
  shape: { borderRadius: 3 },
  typography: {
    fontFamily: XP_BODY_FONT,
    fontSize: 13,
    h1: { fontFamily: XP_HEAD_FONT, fontWeight: 500 },
    h2: { fontFamily: XP_HEAD_FONT, fontWeight: 500 },
    h3: { fontFamily: XP_HEAD_FONT, fontWeight: 500 },
    h4: { fontFamily: XP_HEAD_FONT, fontWeight: 500 },
    h5: { fontFamily: XP_HEAD_FONT, fontWeight: 600 },
    h6: { fontFamily: XP_HEAD_FONT, fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          // Calm solid XP control-silver — no garish sky gradient. White windows
          // with drop shadows pop against it, exactly like an XP dialog.
          backgroundColor: XP_FACE,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: XP_TITLE_GEL,
          color: '#ffffff',
          fontFamily: XP_TITLE_FONT,
          borderBottom: '1px solid #08367f',
          // glossy top highlight + a real drop shadow under the title bar
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 5px rgba(0,0,0,0.40)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid #d4d0be',
          borderRadius: 4,
          boxShadow: XP_WINDOW_SHADOW,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #d4d0be',
          borderRadius: 4,
          boxShadow: `inset 0 1px 0 #ffffff, ${XP_WINDOW_SHADOW}`,
        },
      },
    },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: XP_FACE, borderRight: '1px solid #9aa0a6', boxShadow: XP_WINDOW_SHADOW } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 3,
          border: '1px solid #8a93a5',
          backgroundImage: XP_BTN_GEL,
          color: '#1b2a44',
          boxShadow: XP_BEVEL,
          // Luna's orange focus glow on hover.
          '&:hover': { backgroundImage: XP_BTN_GEL_HOVER, borderColor: '#f0a900', boxShadow: `${XP_BEVEL}, 0 0 4px 1px rgba(255,170,0,0.55)` },
          '&:active': { boxShadow: XP_BEVEL_PRESSED },
        },
        // Blue = neutral primary actions.
        containedPrimary: xpAction(
          xpGel('#7db4f6', '#2f80ee', '#0a51c5', '#1a63d8'),
          xpGel('#92c2f8', '#4490f2', '#1560d4', '#2a72e0'),
          '#08367f',
        ),
        // Green = go / start / submit.
        containedSuccess: xpAction(
          xpGel('#b8e986', '#7cc24a', '#54a331', '#4a9a2c'),
          xpGel('#c6f098', '#8bce58', '#60af3a', '#56a634'),
          '#2c6a1f',
        ),
        // Red = destructive / close.
        containedError: xpAction(
          xpGel('#f6a6a0', '#e0584d', '#c5392d', '#b5281d'),
          xpGel('#f8b6b0', '#e86a5f', '#d2473b', '#c33529'),
          '#7f1b14',
        ),
        // Yellow = log-off / caution.
        containedWarning: { ...xpAction(
          xpGel('#ffe9a8', '#ffcf4d', '#f0b400', '#e0a200'),
          xpGel('#fff0bd', '#ffd866', '#f6bf1a', '#ecae0a'),
          '#a87a00',
        ), color: '#3a2c00', textShadow: '0 1px 0 rgba(255,255,255,0.4)' },
        outlined: { backgroundImage: 'none', borderColor: '#8a93a5', color: XP_BLUE, boxShadow: 'none', '&:hover': { borderColor: '#f0a900', backgroundColor: 'rgba(255,255,255,0.5)' } },
        text: { color: XP_BLUE, border: 'none', backgroundImage: 'none', boxShadow: 'none' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          border: '1px solid #8a93a5',
          backgroundImage: XP_BTN_GEL,
          color: '#1b2a44',
          textTransform: 'none',
          boxShadow: XP_BEVEL,
          '&:hover': { backgroundImage: XP_BTN_GEL_HOVER },
          // Selected = pressed INTO the surface (sunken), XP toolbar style.
          '&.Mui-selected': {
            backgroundImage: 'none',
            backgroundColor: '#d3e3fb',
            color: '#08367f',
            boxShadow: XP_BEVEL_PRESSED,
            '&:hover': { backgroundColor: '#c4d9f8' },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          backgroundColor: '#ffffff',
          boxShadow: XP_SUNKEN,   // recessed 3D field
          '& .MuiOutlinedInput-notchedOutline': { borderColor: XP_LINE },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6f7b7d' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: XP_BLUE, borderWidth: 1 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { color: '#4a5a72', '&.Mui-focused': { color: XP_BLUE } } } },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 3, fontWeight: 700 },
        colorDefault: { backgroundImage: XP_BTN_GEL, border: '1px solid #b7b3a1', boxShadow: 'inset 1px 1px 0 #ffffff' },
        outlined: { borderColor: '#b7b3a1' },
      },
    },
    MuiAlert: { styleOverrides: { root: { borderRadius: 4, border: '1px solid #b7b3a1', boxShadow: XP_WINDOW_SHADOW, backgroundColor: '#ffffff' } } },
    MuiSnackbarContent: { styleOverrides: { root: { borderRadius: 4, backgroundImage: XP_TITLE_GEL, color: '#fff', boxShadow: XP_WINDOW_SHADOW } } },
    MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 0, backgroundColor: '#ffffe1', color: '#000', border: '1px solid #000', boxShadow: '1px 1px 2px rgba(0,0,0,0.4)', fontFamily: XP_BODY_FONT, fontSize: 11 } } },
    MuiDivider: { styleOverrides: { root: { borderColor: '#c4c2b4' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#cfccbd' },
        // Raised silver column header with a bevel.
        head: { fontFamily: XP_HEAD_FONT, fontWeight: 600, color: '#1b2a44', backgroundImage: XP_BTN_GEL, boxShadow: 'inset 0 1px 0 #ffffff, inset 0 -1px 0 #c4c0b0' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(49,106,197,0.08)' },
          // Classic XP selection: solid royal-blue highlight.
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: '#316ac5', color: '#fff' },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          '&.Mui-selected': {
            backgroundColor: '#316ac5',
            color: '#fff',
            boxShadow: XP_BEVEL_PRESSED,
            '&:hover': { backgroundColor: '#2a5cae' },
          },
        },
      },
    },
    MuiTouchRipple: { styleOverrides: { child: { backgroundColor: 'rgba(49,106,197,0.4)' } } },
  },
});

/* ------------------------------------------------------------------ */
/* 6) SHADCN — a faithful shadcn/ui dark theme: zinc-950 canvas,        */
/*    hairline zinc-800 borders instead of shadows, near-white primary  */
/*    on dark, 8px radius, Inter, restrained and minimal.               */
/* ------------------------------------------------------------------ */
const SH_BG = '#09090b';      // zinc-950 / background
const SH_CARD = '#0c0c0e';
const SH_BORDER = '#27272a';  // zinc-800 / border
const SH_FG = '#fafafa';      // zinc-50 / foreground
const SH_MUTED = '#a1a1aa';   // zinc-400 / muted-foreground
const SH_ACCENT = '#18181b';  // zinc-900 / accent (hover)
const SH_FONT = '"Inter", ui-sans-serif, system-ui, "Segoe UI", sans-serif';

const shadcnTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: SH_FG, contrastText: '#18181b' },
    secondary: { main: '#a1a1aa' },
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    info: { main: '#60a5fa' },
    background: { default: SH_BG, paper: SH_CARD },
    text: { primary: SH_FG, secondary: SH_MUTED },
    divider: SH_BORDER,
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: SH_FONT,
    h1: { fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontWeight: 600, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          backgroundColor: SH_BG,
          color: SH_FG,
          // Dark canvas: invert the white-bg video to black, then screen it out.
          '--landing-video-blend': 'screen',
          '--landing-video-filter': 'invert(1) hue-rotate(180deg)',
          '--heart-title-glow-strong': 'rgba(9, 9, 11, 0.85)',
          '--heart-title-glow-soft': 'rgba(9, 9, 11, 0.6)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: SH_BG, color: SH_FG, boxShadow: 'none', borderBottom: `1px solid ${SH_BORDER}`, backgroundImage: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: SH_CARD, border: `1px solid ${SH_BORDER}`, boxShadow: 'none' },
      },
    },
    MuiCard: { styleOverrides: { root: { backgroundColor: SH_CARD, border: `1px solid ${SH_BORDER}`, boxShadow: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: SH_BG, borderRight: `1px solid ${SH_BORDER}` } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
        containedPrimary: { backgroundColor: SH_FG, color: '#18181b', '&:hover': { backgroundColor: '#e4e4e7' } },
        outlined: { borderColor: SH_BORDER, color: SH_FG, '&:hover': { backgroundColor: SH_ACCENT, borderColor: SH_BORDER } },
        text: { color: SH_FG, '&:hover': { backgroundColor: SH_ACCENT } },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          color: SH_MUTED,
          borderColor: SH_BORDER,
          '&.Mui-selected': { backgroundColor: SH_FG, color: '#18181b', '&:hover': { backgroundColor: '#e4e4e7' } },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'transparent',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: SH_BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3f3f46' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d4d4d8', borderWidth: 2 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { color: SH_MUTED, '&.Mui-focused': { color: SH_FG } } } },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500 },
        colorDefault: { backgroundColor: SH_ACCENT, border: `1px solid ${SH_BORDER}`, color: SH_FG },
        outlined: { borderColor: SH_BORDER, color: SH_FG },
      },
    },
    MuiAlert: { styleOverrides: { root: { borderRadius: 8, border: `1px solid ${SH_BORDER}`, backgroundColor: SH_CARD, color: SH_FG } } },
    MuiSnackbarContent: { styleOverrides: { root: { borderRadius: 8, backgroundColor: SH_FG, color: '#18181b' } } },
    MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 6, backgroundColor: SH_FG, color: '#18181b', fontWeight: 500 } } },
    MuiDivider: { styleOverrides: { root: { borderColor: SH_BORDER } } },
    MuiTableCell: { styleOverrides: { root: { borderColor: SH_BORDER }, head: { fontWeight: 600, color: SH_MUTED, backgroundColor: 'transparent' } } },
    MuiTableRow: { styleOverrides: { root: { '&:hover': { backgroundColor: SH_ACCENT }, '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: SH_ACCENT } } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 8, '&.Mui-selected': { backgroundColor: SH_ACCENT, '&:hover': { backgroundColor: '#1f1f23' } } } } },
    MuiTouchRipple: { styleOverrides: { child: { backgroundColor: 'rgba(250,250,250,0.3)' } } },
  },
});

export const DEFAULT_THEME_KEY = 'default';

export const THEMES = {
  default: defaultTheme,
  glass: glassTheme,
  vintage: vintageTheme,
  'ai-slop': aiSlopTheme,
  'xp-vista': xpVistaTheme,
  shadcn: shadcnTheme,
};

export const THEME_OPTIONS = [
  { key: 'default', label: 'Classic', description: 'The standard, no-frills Material look.' },
  { key: 'glass', label: 'Liquid Glass — Apple style', description: 'Frosted, translucent surfaces with specular rims over a calm neutral backdrop.' },
  { key: 'vintage', label: 'Vintage', description: 'Warm, serif, clean legacy aesthetic with coffee tones.' },
  { key: 'ai-slop', label: 'AI Slop', description: 'Every trending generative-AI cliché at once: neon violet→pink→cyan gradients, glowing pill buttons, glassy gradient cards on a dark void.' },
  { key: 'xp-vista', label: 'XP Vista', description: 'Early-2000s Windows nostalgia — Luna-blue glossy title bars, the silver window face, Tahoma, and the green Start-button for primary actions.' },
  { key: 'shadcn', label: 'shadcn', description: 'A faithful shadcn/ui dark theme: zinc canvas, hairline borders, near-white primary, 8px radius, Inter.' },
];
