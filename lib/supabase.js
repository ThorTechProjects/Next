import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Add in .env.local
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Add in .env.local

//export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'january_2025' } })

