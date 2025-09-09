'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Link,
  Grid,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import {
  SignupFormData,
  signupSchema,
} from '@/utils/schemas/auth/signup.schema';

export default function SignupForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      agreeToTerms: false,
    },
  });

  // TODO: Implement signup
  const onSubmit = async (data: SignupFormData) => {};

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
        Join Planova Today
      </Typography>

      <Typography
        variant='body1'
        sx={{
          color: '#6b7280',
          mb: 4,
          lineHeight: 1.6,
        }}
      >
        Unlock powerful planning tools and collaborate seamlessly. Create your
        free account to get started in seconds!
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
        Sign up with Google
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
        <Grid container spacing={2}>
          <Controller
            name='firstname'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant='outlined'
                label='First Name'
                autoCapitalize='on'
                placeholder='First Name'
                error={!!errors.firstname}
                helperText={errors.firstname?.message}
                sx={{ flex: 1 }}
              />
            )}
          />
          <Controller
            name='lastname'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant='outlined'
                label='Last Name'
                autoCapitalize='on'
                placeholder='Last Name'
                error={!!errors.lastname}
                helperText={errors.lastname?.message}
                sx={{ flex: 1 }}
              />
            )}
          />
        </Grid>
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
        <Grid container direction={'column'} sx={{ gap: '8px' }}>
          <Controller
            name='agreeToTerms'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    sx={{
                      color: errors.agreeToTerms ? '#ef4444' : '#d1d5db',
                      '&.Mui-checked': {
                        color: '#6366f1',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant='body2' sx={{ color: '#374151' }}>
                    I agree to the{' '}
                    <Link
                      href='/terms-and-conditions'
                      sx={{
                        color: '#6366f1',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Terms & Conditions
                    </Link>
                  </Typography>
                }
              />
            )}
          />

          {errors.agreeToTerms && (
            <Typography
              variant='caption'
              sx={{ color: '#ef4444', display: 'block' }}
            >
              {errors.agreeToTerms.message}
            </Typography>
          )}
        </Grid>

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
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </Button>
      </Box>

      <Typography variant='body2' sx={{ color: '#6b7280' }}>
        Already have an account?{' '}
        <Link
          href='/sign-in'
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
          Sign in now
        </Link>
      </Typography>
    </Box>
  );
}
