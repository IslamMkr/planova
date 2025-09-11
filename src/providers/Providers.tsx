'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { AuthProvider } from './AuthProvider';
import { Slide, ToastContainer } from 'react-toastify';
import AppThemeProvider from './AppThemeProvider';
import { User } from '@supabase/supabase-js';

import 'react-toastify/ReactToastify.css';

interface ProvidersProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export const Providers = ({ children, initialUser }: ProvidersProps) => {
  return (
    <AppRouterCacheProvider>
      <AppThemeProvider>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        <ToastContainer
          position='bottom-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={'light'}
          transition={Slide}
        />
      </AppThemeProvider>
    </AppRouterCacheProvider>
  );
};