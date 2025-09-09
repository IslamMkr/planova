import SignInForm from '@/components/auth/SignInForm';
import { Grid } from '@mui/material';

const SignInPage = () => {
  return (
    <Grid container justifyContent='center' alignItems='center'>
      <SignInForm />
    </Grid>
  );
};

export default SignInPage;
