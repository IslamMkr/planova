import { Box, Typography, Button } from '@mui/material';

const NotFound = async () => {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box textAlign='center'>
        <Typography variant='h2' color='primary' gutterBottom>
          404
        </Typography>
        <Typography variant='h5' gutterBottom>
          Oops! We couldn't find that page.
        </Typography>
        <Typography variant='body1' color='textSecondary' paragraph>
          The page you’re looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button variant='outlined' color='primary' href='/'>
          Go to Homepage
        </Button>
      </Box>
    </main>
  );
};

export default NotFound;
