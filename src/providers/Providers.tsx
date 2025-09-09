import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './AuthProvider';
import { Slide, ToastContainer } from 'react-toastify';
import theme from '../theme/theme';

import 'react-toastify/ReactToastify.css';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
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
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
