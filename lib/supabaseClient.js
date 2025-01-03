import { createClient } from '@supabase/supabase-js';

// Function to initialize the Supabase client with a dynamic schema
export const createSupabaseClientWithSchema = (schema) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey, { db: { schema } });
};
