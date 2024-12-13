// app/api/upload/route.js

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import csvParser from 'csv-parser';

const supabase = createClient(
  "https://myttudmnflmxlkxtcaso.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dHR1ZG1uZmxteGxreHRjYXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxOTI2NDgsImV4cCI6MjA0ODc2ODY0OH0.cVPKBwuZGTOpLDMCfBACuAtn7W2MFCaPJP0GE8IcL1s"
);

export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle the file upload manually
  },
};

export async function POST(req) {
  const filePath = path.join(process.cwd(), 'public', 'uploaded-file.csv'); // Path where you want to save the file

  const chunks = [];
  req.body.on('data', chunk => {
    chunks.push(chunk);
  });

  req.body.on('end', async () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(filePath, buffer); // Save the file to the server

    try {
      // Parse the CSV file
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => rows.push(data))
        .on('end', async () => {
          // Insert data into Supabase, checking for duplicates by 'Request Id'
          for (const row of rows) {
            const { 'Request Id': requestId } = row;
            const { data: existingData } = await supabase
              .from('klm')
              .select('Request Id')
              .eq('Request Id', requestId);

            // Insert data only if 'Request Id' doesn't already exist
            if (existingData.length === 0) {
              const { error } = await supabase.from('klm').insert([{
                Priority: row.Priority,
                'Service Code': row['Service Code'],
                POSCode: row.POSCode,
                Airline: row.Airline,
                'Request Id': row['Request Id'],
                'Contact Name': row['Contact Name'],
                PNRNO: row.PNRNO,
                'Flow Type': row['Flow Type'],
                Action: row.Action,
                Added: row.Added,
                'Curr Stat Date': row['Curr Stat Date'],
                'Pending Reason': row['Pending Reason'],
              }]);

              if (error) {
                console.error('Error inserting data:', error.message);
              }
            }
          }
          return new Response(JSON.stringify({ message: 'File uploaded and data inserted successfully!' }), { status: 200 });
        });
    } catch (error) {
      console.error('Error uploading and processing file:', error);
      return new Response(JSON.stringify({ message: 'Error processing file', error: error.message }), { status: 500 });
    }
  });

  req.body.on('error', (err) => {
    return new Response(JSON.stringify({ message: 'Error uploading file', error: err.message }), { status: 500 });
  });
}
