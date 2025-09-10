// src/theme/overrides.ts
import type { Components, Theme } from '@mui/material/styles';
import { RADIUS, SPACING } from './tokens';

export const components = (theme: Theme): Components<typeof theme> => ({
  MuiCssBaseline: {
    styleOverrides: {
      ':root': {
        '--focus-ring': `0 0 0 3px ${theme.palette.primary.main}33`,
      },
      '*:focus-visible': {
        outline: 'none',
        borderRadius: `${RADIUS.sm}px`,
      },
      '@media (prefers-reduced-motion: reduce)': {
        '*': {
          animationDuration: '0.001ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.001ms !important',
          scrollBehavior: 'auto !important',
        },
      },
    },
  },

  MuiContainer: {
    defaultProps: { maxWidth: 'lg' },
    styleOverrides: {
      root: {
        paddingLeft: SPACING * 2,
        paddingRight: SPACING * 2,
        '@media (min-width:1536px)': {
          maxWidth: '80vw', // ≈ 80% width on very large screens
        },
      },
    },
  },

  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: RADIUS.md,
        fontWeight: 600,
        textTransform: 'none',
        paddingInline: SPACING * 2,
        minHeight: 40,
      },
      sizeSmall: { minHeight: 34, borderRadius: RADIUS.sm },
      sizeLarge: { minHeight: 48, borderRadius: RADIUS.lg },
    },
    variants: [
      // Soft variant
      {
        props: { variant: 'soft' as any, color: 'primary' },
        style: {
          background: theme.palette.primary.main + '1A', // ~10% alpha
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
          border: `1px solid ${theme.palette.primary.main}33`,
          '&:hover': {
            background: theme.palette.primary.main + '26',
            borderColor: theme.palette.primary.main + '66',
          },
        },
      },
      // Outline (slightly stronger than default "outlined")
      {
        props: { variant: 'outline' as any },
        style: {
          borderWidth: 2,
          '&:hover': { borderWidth: 2 },
        },
      },
    ],
  },

  MuiChip: {
    styleOverrides: {
      root: { borderRadius: RADIUS.pill, fontWeight: 600 },
    },
    variants: [
      {
        props: { variant: 'soft' as any, color: 'default' },
        style: {
          background: theme.palette.action.selected,
          border: `1px solid ${theme.palette.divider}`,
        },
      },
    ],
  },

  MuiLink: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        textUnderlineOffset: 3,
        '&:hover': { textDecorationThickness: 2 },
      },
    },
    defaultProps: {
      underline: 'hover',
      component: undefined as unknown as any, // set via theme in index.ts
    },
  },

  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: { backgroundImage: 'none' },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: RADIUS.lg,
        border: `1px solid ${theme.palette.divider}`,
      },
    },
  },

  MuiTextField: {
    defaultProps: { size: 'medium' },
  },
  MuiFormControl: { defaultProps: { size: 'medium' } },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: RADIUS.sm,
        fontSize: 12,
        fontWeight: 600,
      },
    },
  },
});
