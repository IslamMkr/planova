// src/components/ThemeToggle.tsx
'use client';

import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAppTheme } from '@/providers/AppThemeProvider';

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useAppTheme();
  return (
    <Tooltip title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
      <IconButton
        onClick={toggleColorMode}
        aria-label='toggle theme'
        edge='end'
      >
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
