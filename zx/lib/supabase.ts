import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ltfdhwvztsqsskvggemu.supabase.co';
const SUPABASE_KEY = '********';

const client = createClient(SUPABASE_URL, SUPABASE_KEY);
export default client;
