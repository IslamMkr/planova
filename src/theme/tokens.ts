// src/theme/tokens.ts
export const BRAND = {
  primary: '#2563EB', // blue-600
  primarySoft: '#DBEAFE',
  primaryHover: '#1D4ED8',
  primaryOn: '#FFFFFF',

  secondary: '#7C3AED', // violet-600
  secondarySoft: '#EDE9FE',
  secondaryHover: '#6D28D9',
  secondaryOn: '#FFFFFF',

  neutral: '#64748B', // slate-500

  success: '#16A34A',
  info: '#0284C7',
  warning: '#D97706',
  error: '#DC2626',

  // Surfaces
  lightBg: '#FFFFFF',
  lightPaper: '#FFFFFF',
  darkBg: '#1c2844ff',
  darkPaper: '#1c2844ff',
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const SPACING = 8; // base spacing unit

export const SHADOWS = {
  light: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04)',
    '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    '0 4px 6px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)',
    '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)',
  ],
  dark: [
    'none',
    '0 1px 2px rgba(0,0,0,0.5)',
    '0 1px 3px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.45)',
    '0 4px 6px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.45)',
    '0 10px 15px rgba(0,0,0,0.55), 0 4px 6px rgba(0,0,0,0.4)',
  ],
};
