// pages/api/parseCsv.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    "https://myttudmnflmxlkxtcaso.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dHR1ZG1uZmxteGxreHRjYXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxOTI2NDgsImV4cCI6MjA0ODc2ODY0OH0.cVPKBwuZGTOpLDMCfBACuAtn7W2MFCaPJP0GE8IcL1s"
  );
export default async function handler(req, res) {
  try {
    // Fetch data from Supabase table 'klm'
    const { data, error } = await supabase.from('klm').select('*');

    if (error) {
      return res.status(500).json({ message: 'Error fetching data from Supabase', error: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
}
