'use client'
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Import Supabase client
import { TextField, Button, CircularProgress, Typography, Box } from '@mui/material'; // MUI components

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // User successfully logged in
      setUser(data.user); // Set user data to show on the page
    } catch (error) {
      setError('An error occurred during login.');
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

      const metadata = user.user_metadata; // Get the metadata
      console.log('User Metadata:', metadata);
    } catch (error) {
      setError('An error occurred while retrieving user data.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ marginTop: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Log In'}
        </Button>
        {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
      </form>

      {user && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">User Information:</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>T-ID: {user.user_metadata.t_id}</Typography>
          <Typography>Role: {user.user_metadata.role}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Login;
