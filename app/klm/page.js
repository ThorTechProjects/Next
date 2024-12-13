'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';
import { TextField, Button, CircularProgress, Typography, Box, Grid } from '@mui/material';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [employeeId, setEmployeeId] = useState(''); // State to store employee ID
  const [user, setUser] = useState(null); // Store user data
  const [isLoading, setIsLoading] = useState(false); // To show loading state

  // Fetch user data from Supabase and extract the employee ID from metadata
  const fetchUserData = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      setUser(user); // Set user data
      if (user && user.user_metadata) {
        setEmployeeId(user.user_metadata.t_id); // Extract employee ID from metadata
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Run fetchUserData on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDate(new Date(e.target.files[0].lastModified));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a CSV file.');
    if (!employeeId.trim()) return alert('Employee ID is required.');

    setStatus('Processing file...');
    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        console.log('Parsed Results:', results.data);

        const validRows = results.data.filter(
          (row) => row['Request Id'] && row['Request Id'].trim() !== ''
        );

        if (validRows.length === 0) {
          console.error('No valid rows found in the CSV.');
          setStatus('No valid rows found in the CSV.');
          setIsLoading(false);
          return;
        }

        const uniqueRows = Array.from(
          new Map(results.data.map((row) => [row['Request Id'].trim(), row]))
        ).map(([_, row]) => row);

        if (uniqueRows.length === 0) {
          console.error('No unique rows found after deduplication.');
          setStatus('No unique rows found after deduplication.');
          setIsLoading(false);
          return;
        }

        // Add employee ID from user metadata to each row
        const rowsWithEmployeeId = uniqueRows.map((row) => ({
          ...row,
          'Employee Id': employeeId, // Use the employee ID from metadata
        }));

        // Get the current day and format the table name
        const day = String(date.getDate()).padStart(2, '0');
        const tableName = `day_${day}`;

        try {
          const { data, error } = await supabase
            .from(tableName)
            .upsert(rowsWithEmployeeId, { onConflict: 'Request Id' })
            .select('*');

          if (error) {
            console.error('Supabase Error:', error);
            setStatus('Error uploading data to the database.');
            setIsLoading(false);
            return;
          }

          console.log('Supabase Data:', data);
          setStatus(`Successfully uploaded ${data.length} rows!`);
          setIsLoading(false);

        } catch (err) {
          console.error('Unexpected Error:', err);
          setStatus('An unexpected error occurred.');
          setIsLoading(false);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setStatus('Failed to parse CSV file.');
        setIsLoading(false);
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Upload CSV and Upsert to Supabase</Typography>
      <Typography variant="body1" gutterBottom>
        Employee ID: <strong>{employeeId}</strong> (Auto-filled from your login metadata)
      </Typography>
      <form onSubmit={handleUpload}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              label="Employee ID"
              variant="outlined"
              fullWidth
              value={employeeId}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ marginTop: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
        {status}
      </Typography>
    </Box>
  );
}
