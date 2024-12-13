'use client'
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Import Supabase client
import { Button, CircularProgress, Typography, Box } from '@mui/material'; // MUI components

const Logout = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await supabase.auth.signOut();

      // Clear the user state after successful logout
      setUser(null);
      setMessage('You have successfully logged out.');
    } catch (error) {
      setError('An error occurred during logout.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setError('Failed to fetch user data.');
        return;
      }

      // Display user info
      setUser(user);
    } catch (error) {
      setError('An error occurred while retrieving user data.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Logout</Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {user ? (
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="h6">User Information:</Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>T-ID: {user.user_metadata.t_id}</Typography>
              <Typography>Role: {user.user_metadata.role}</Typography>
            </Box>
          ) : (
            <Typography variant="body1">No user is logged in.</Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Log Out'}
          </Button>
        </>
      )}

      {message && <Typography sx={{ marginTop: 2 }} color="primary">{message}</Typography>}
      {error && <Typography sx={{ marginTop: 2 }} color="error">{error}</Typography>}
    </Box>
  );
};

export default Logout;
