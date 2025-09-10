'use client';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@mui/material';
import React from 'react';

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    // This is a protected route, you can add authentication logic here
    console.log('DashboardPage mounted');
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      Dashboard Page
      <p>Mount count: {count}</p>
      <p>User: {user?.email}</p>
      <Button variant='outlined' color='error' onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default DashboardPage;
