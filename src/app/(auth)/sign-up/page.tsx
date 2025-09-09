import SignUpForm from '@/components/auth/SignUpForm';
import { Grid } from '@mui/material';

const SignUp = () => {
  return (
    <Grid container justifyContent='center' alignItems='center'>
      <SignUpForm />
    </Grid>
  );
};

export default SignUp;
