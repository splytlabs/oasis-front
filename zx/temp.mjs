#!/usr/bin/env -S pnpm zx
import 'zx/globals';
import { createClient } from '@supabase/supabase-js';

$.verbose = true;

const SUPABASE_URL = 'https://ltfdhwvztsqsskvggemu.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZmRod3Z6dHNxc3NrdmdnZW11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1Nzk3NTUwOCwiZXhwIjoxOTczNTUxNTA4fQ.0KD12T1nZuAjxa9kKO3zBw_mZEGEAPrnkiYZD_2vcJ8';

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const result = await client
  .from('nft_infos')
  .select('id,name,image,Speed')
  .limit(5)
  .gt('Speed', 50)
  .lt('Speed', 80);
console.log('result.body', result.body);
