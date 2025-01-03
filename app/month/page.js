'use client'
import React, { useState } from 'react';
import { createSupabaseClientWithSchema } from '../../supabaseClient';

const MyComponent = () => {
  const [selectedSchema, setSelectedSchema] = useState('january_2025'); // Default schema
  const [supabase, setSupabase] = useState(createSupabaseClientWithSchema(selectedSchema));

  // Function to handle schema change
  const handleSchemaChange = (event) => {
    const newSchema = event.target.value;
    setSelectedSchema(newSchema); // Update selected schema
    const newSupabase = createSupabaseClientWithSchema(newSchema); // Create a new Supabase client with the new schema
    setSupabase(newSupabase); // Update the Supabase client
  };

  const fetchData = async () => {
    const { data, error } = await supabase.from('your_table').select('*');
    if (error) {
      console.error('Error fetching data:', error.message);
    } else {
      console.log('Fetched data:', data);
    }
  };

  return (
    <div>
      <select onChange={handleSchemaChange} value={selectedSchema}>
        <option value="january_2025">January 2025</option>
        <option value="december_2024">December 2024</option>
        {/* Add more options for other schemas as needed */}
      </select>

      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
};

export default MyComponent;
