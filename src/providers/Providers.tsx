import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { AuthProvider } from './AuthProvider';
import { createClient } from '@/services/supabase/server';
import { Slide, ToastContainer } from 'react-toastify';
import AppThemeProvider from './AppThemeProvider';

import 'react-toastify/ReactToastify.css';

export const Providers = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  return (
    <AppRouterCacheProvider>
      <AppThemeProvider>
        <AuthProvider initialUser={user}>{children}</AuthProvider>
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
