'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

export default function Footer() {
  const year = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component='footer'
      sx={{
        mt: 'auto',
        backdropFilter: 'saturate(160%) blur(10px)',
        WebkitBackdropFilter: 'saturate(160%) blur(10px)',
        backgroundColor: alpha(
          theme.palette.background.paper,
          theme.palette.mode === 'dark' ? 0.18 : 0.75,
        ),
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        color: 'text.primary',
      }}
    >
      <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Brand / Tagline */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant='h6' fontWeight={800} gutterBottom>
              YourBrand
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Build great things. Minimal, fast, and accessible by default.
            </Typography>
            <Stack direction='row' spacing={1} sx={{ mt: 2 }}>
              <IconButton
                aria-label='GitHub'
                component='a'
                href='https://github.com/'
                target='_blank'
                rel='noopener noreferrer'
                sx={{ color: 'text.secondary' }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                aria-label='LinkedIn'
                component='a'
                href='https://linkedin.com/'
                target='_blank'
                rel='noopener noreferrer'
                sx={{ color: 'text.secondary' }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                aria-label='X'
                component='a'
                href='https://x.com/'
                target='_blank'
                rel='noopener noreferrer'
                sx={{ color: 'text.secondary' }}
              >
                <XIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant='subtitle1' fontWeight={700} gutterBottom>
              Company
            </Typography>
            <Stack spacing={1.25}>
              <Link href='/about'>About</Link>
              <Link href='/careers'>Careers</Link>
              <Link href='/blog'>Blog</Link>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant='subtitle1' fontWeight={700} gutterBottom>
              Resources
            </Typography>
            <Stack spacing={1.25}>
              <Link href='/docs'>Docs</Link>
              <Link href='/changelog'>Changelog</Link>
              <Link href='/status'>Status</Link>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Box
          sx={{
            mt: { xs: 4, md: 6 },
            pt: { xs: 2, md: 3 },
            borderTop: `1px dashed ${alpha(theme.palette.divider, 0.6)}`,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            © {year} YourBrand. All rights reserved.
          </Typography>
          <Stack direction='row' spacing={2}>
            <Link href='/privacy'>Privacy</Link>
            <Link href='/terms'>Terms</Link>
            <Link href='/contact'>Contact</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
