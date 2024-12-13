'use client'
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a CSV file.');

    setStatus('Processing file...');

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
          return;
        }

        const uniqueRows = Array.from(
          new Map(results.data.map((row) => [row['Request Id'].trim(), row]))
        ).map(([_, row]) => row);

        if (uniqueRows.length === 0) {
          console.error('No unique rows found after deduplication.');
          setStatus('No unique rows found after deduplication.');
          return;
        }

        const formattedRows = uniqueRows.map((row) => ({
          // Add other fields here as needed
        }));

        console.log('Formatted Rows:', formattedRows);

        try {
          const { data, error } = await supabase
            .from('klm')
            .upsert(uniqueRows, { onConflict: 'Request Id' })
            .select('*');
            setStatus(`Successfully uploaded ${data.length} rows!`);


          if (error) {
            console.error('Supabase Error:', error);
            setStatus('Error uploading data to the database.');
            return;
          } else {
            const { data, error } = await supabase
              .from('klm')
              .upsert(uniqueRows, { onConflict: 'Request Id' })
              .select('*'); // 
            console.log('Supabase Data:', data);
          //  setStatus(`Successfully uploaded ${data.length} rows!`);

          }


        } catch (err) {
          console.error('Unexpected Error:', err);
          setStatus('An unexpected error occurred.');
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setStatus('Failed to parse CSV file.');
      },
    });
  }
  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload CSV and Upsert to Supabase</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
