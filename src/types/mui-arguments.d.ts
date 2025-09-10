// src/types/mui-augments.d.ts
import '@mui/material/Button';
import '@mui/material/Chip';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    soft: true;
    outline: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}
