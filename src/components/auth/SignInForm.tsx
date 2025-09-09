'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import {
  SigninFormData,
  signinSchema,
} from '@/utils/schemas/auth/signin.schema';

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // TODO: Implement sign in
  const onSubmit = async (data: SigninFormData) => {};

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        maxWidth: 600,
        p: 8,
      }}
    >
      <Typography
        variant='h4'
        component='h1'
        sx={{
          fontWeight: 600,
          color: '#1f2937',
          mb: 2,
        }}
      >
        Welcome Back!
      </Typography>

      <Typography
        variant='body1'
        sx={{
          color: '#6b7280',
          mb: 4,
          lineHeight: 1.6,
        }}
      >
        Sign in to your account to access all features and manage your projects
        seamlessly.
      </Typography>

      <Button
        disabled
        variant='outlined'
        fullWidth
        startIcon={<Google />}
        sx={{
          mb: 3,
          py: 1.5,
          borderColor: '#d1d5db',
          color: '#374151',
          textTransform: 'none',
          fontSize: '16px',
          '&:hover': {
            borderColor: '#9ca3af',
            bgcolor: '#f9fafb',
          },
        }}
      >
        Sign in with Google
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography sx={{ px: 2, color: '#9ca3af', fontSize: '14px' }}>
          or
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              label='Email'
              fullWidth
              placeholder='example@example.com'
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Grid container style={{ gap: 8 }}>
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant='outlined'
                label='Password'
                fullWidth
                type='password'
                placeholder='Enter a strong password'
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Link
            href='/forgot-password'
            underline='none'
            sx={{ color: '#6366f1', fontSize: 14 }}
          >
            Forgot Password?
          </Link>
        </Grid>

        <Controller
          name='rememberMe'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  sx={{
                    color: '#d1d5db',
                    '&.Mui-checked': { color: '#6366f1' },
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#374151' }}>Remember Me</Typography>
              }
            />
          )}
        />

        <Button
          type='submit'
          variant='contained'
          fullWidth
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            bgcolor: '#6366f1',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            mb: 3,
            '&:hover': {
              bgcolor: '#5856eb',
            },
            '&:disabled': {
              bgcolor: '#9ca3af',
            },
          }}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </Box>

      <Typography variant='body2' sx={{ color: '#6b7280' }}>
        Don&apos;t have an account?{' '}
        <Link
          href='/sign-up'
          underline='none'
          sx={{
            color: '#6366f1',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline',
            },
            marginLeft: '6px',
          }}
        >
          Create an account
        </Link>
      </Typography>
    </Box>
  );
}
