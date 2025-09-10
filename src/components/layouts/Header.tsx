'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

// If you created the toggle earlier; otherwise remove this line.
import ThemeToggle from '@/components/ThemeToggle';

const NAV = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

function useElevateOnScroll() {
  return useScrollTrigger({ disableHysteresis: true, threshold: 8 });
}

export default function Header() {
  const pathname = usePathname();
  const elevated = useElevateOnScroll();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <AppBar
        position='sticky'
        elevation={0}
        sx={(theme) => {
          // Base transparency (not total), slightly more opaque when scrolled
          const baseOpacity = theme.palette.mode === 'dark' ? 0.16 : 0.65;
          const scrolledOpacity = theme.palette.mode === 'dark' ? 0.28 : 0.85;

          return {
            top: 0,
            zIndex: theme.zIndex.appBar,
            backgroundColor: alpha(
              theme.palette.background.paper,
              elevated ? scrolledOpacity : baseOpacity,
            ),
            backdropFilter: 'saturate(160%) blur(10px)',
            WebkitBackdropFilter: 'saturate(160%) blur(10px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            color: 'text.primary',
            transition: theme.transitions.create(
              ['background-color', 'backdrop-filter', 'border-color'],
              { duration: theme.transitions.duration.shorter },
            ),
          };
        }}
      >
        <Container maxWidth='lg'>
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            {/* Brand */}
            <Typography
              component={Link}
              href='/'
              variant='h6'
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 800,
                letterSpacing: 0.3,
              }}
            >
              YourBrand
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop nav */}
            <Stack
              direction='row'
              spacing={1}
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}
            >
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    size='medium'
                    sx={(theme) => ({
                      px: 1.25,
                      fontWeight: 600,
                      textTransform: 'none',
                      color: active
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                      '&::after': {
                        content: '""',
                        display: 'block',
                        height: 2,
                        borderRadius: 1,
                        backgroundColor: active
                          ? theme.palette.primary.main
                          : 'transparent',
                        transform: active ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'transform 180ms ease',
                      },
                      '&:hover::after': {
                        backgroundColor: theme.palette.primary.main,
                        transform: 'scaleX(1)',
                      },
                    })}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            {/* Actions (desktop) */}
            <Stack
              direction='row'
              spacing={1.5}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {/* Optional theme toggle */}
              <ThemeToggle />
              <Button
                component={Link}
                href='/sign-in'
                variant='text'
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                href='/sign-up'
                variant='contained'
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
              >
                Sign up
              </Button>
            </Stack>

            {/* Mobile menu button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
              <IconButton aria-label='menu' onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{ width: 300 }}
          role='presentation'
          onClick={() => setOpen(false)}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant='h6' fontWeight={800}>
              Menu
            </Typography>
          </Box>
          <Divider />
          <List>
            {NAV.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={pathname === item.href}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Stack spacing={1.25}>
              <Button
                component={Link}
                href='/sign-in'
                fullWidth
                variant='outlined'
              >
                Sign in
              </Button>
              <Button
                component={Link}
                href='/sign-up'
                fullWidth
                variant='contained'
              >
                Sign up
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
