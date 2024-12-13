// app/signup/page.js
'use client'

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';  // Import Supabase client
import { TextField, Button, Box, Typography } from '@mui/material';  // MUI components

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tId, setTId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleSignUp = async () => {
    try {
      // Determine the role based on T-ID
      const role = tId === 't739421' ? 'admin' : 'user';

      // Sign up the user with email, password, and metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        confirmed_at: '2024-12-13 00:36:42.260278+00',
        options: {
          data: {
            t_id: tId,    // Store T-ID in the metadata
            role: role,   // Assign role based on T-ID
          },
        },
      });

      if (error) {
        setError('Error signing up: ' + error.message);
        setSuccess('');
      } else {
        setSuccess('Signed up successfully!');
        setError(null);
      }
    } catch (error) {
      setError('Error signing up: ' + error.message);
      setSuccess('');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h5" component="h1">Sign Up</Typography>
      
      {/* Display error or success messages */}
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success">{success}</Typography>}

      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        label="T-ID"
        fullWidth
        value={tId}
        onChange={(e) => setTId(e.target.value)}
        margin="normal"
      />
      <Button
        onClick={handleSignUp}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignUpPage;
