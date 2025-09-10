'use client';

import * as React from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme, PaletteMode } from '@/theme';

type ThemeContextValue = {
  mode: PaletteMode;
  toggleColorMode: () => void;
  setMode: (m: PaletteMode) => void;
};
const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

export const useAppTheme = () => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within AppThemeProvider');
  return ctx;
};

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
    { noSsr: true },
  );

  const [mode, setMode] = React.useState<PaletteMode>(() => 'light'); // SSR default

  React.useEffect(() => {
    const stored = localStorage.getItem('mui-mode') as PaletteMode | null;
    setMode(stored ?? (systemPrefersDark ? 'dark' : 'light'));
  }, [systemPrefersDark]);

  React.useEffect(() => {
    localStorage.setItem('mui-mode', mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
      meta.setAttribute('content', mode === 'dark' ? '#0B0F19' : '#ffffff');
    // Optional: toggle a class for reduced motion styling
    document.documentElement.classList.toggle(
      'reduced-motion',
      !!prefersReducedMotion,
    );
  }, [mode, prefersReducedMotion]);

  const value = React.useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
      setMode,
    }),
    [mode],
  );

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
