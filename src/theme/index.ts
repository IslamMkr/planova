// src/theme/index.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { components as componentsFn } from './overrides';
import { BRAND, RADIUS } from './tokens';
import { LinkBehavior } from './linkBehavior';

const typography = {
  fontFamily: [
    'Inter',
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
  ].join(','),
  h1: {
    fontSize: 'clamp(2rem, 1.6rem + 2vw, 3.25rem)',
    fontWeight: 800,
    lineHeight: 1.1,
  },
  h2: {
    fontSize: 'clamp(1.6rem, 1.3rem + 1.2vw, 2.25rem)',
    fontWeight: 800,
    lineHeight: 1.15,
  },
  h3: {
    fontSize: 'clamp(1.4rem, 1.2rem + 0.8vw, 1.75rem)',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 700 },
  h6: { fontWeight: 700 },
  subtitle1: { fontWeight: 600 },
  button: { textTransform: 'none', fontWeight: 600 },
  body1: { fontSize: '1rem' },
  body2: { fontSize: '0.925rem' },
} as const;

export type PaletteMode = 'light' | 'dark';

const common = {
  shape: { borderRadius: RADIUS.md },
  typography,
  components: {} as any, // filled per-theme below
} as const;

function buildTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';

  const palette = {
    mode,
    primary: { main: BRAND.primary, contrastText: BRAND.primaryOn },
    secondary: { main: BRAND.secondary, contrastText: BRAND.secondaryOn },
    background: {
      default: isDark ? BRAND.darkBg : BRAND.lightBg,
      paper: isDark ? BRAND.darkPaper : BRAND.lightPaper,
    },
    text: {
      primary: isDark ? '#E6EAF2' : '#0B1220',
      secondary: isDark ? '#B9C1D6' : '#49566D',
    },
    divider: isDark ? '#23314F' : '#E5E7EB',
    success: { main: BRAND.success },
    info: { main: BRAND.info },
    warning: { main: BRAND.warning },
    error: { main: BRAND.error },
    action: {
      hoverOpacity: 0.08,
      selectedOpacity: 0.12,
      focusOpacity: 0.16,
      disabledOpacity: 0.38,
    },
  };

  let theme = createTheme({
    palette,
    ...common,
    // Make MUI Link render NextLink by default
    components: {
      ...(componentsFn as any), // placeholder to allow passing theme later
    } as any,
  });

  // Now that theme exists, inject component overrides using it
  theme = createTheme(theme, {
    components: {
      ...componentsFn(theme),
      MuiLink: {
        ...(componentsFn(theme).MuiLink ?? {}),
        defaultProps: {
          ...(componentsFn(theme).MuiLink?.defaultProps ?? {}),
          component: LinkBehavior as any,
        },
      },
    },
  });

  return responsiveFontSizes(theme);
}

export const getTheme = (mode: PaletteMode) => buildTheme(mode);
