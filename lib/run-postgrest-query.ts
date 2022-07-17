// import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ltfdhwvztsqsskvggemu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZmRod3Z6dHNxc3NrdmdnZW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc5NzU1MDgsImV4cCI6MTk3MzU1MTUwOH0.nvrndu77J1HyW16IlWTWTGSJDAwfXd_jzBgTersXA5U';

export type RunPostgrestQueryOptions = {
  endpointURL?: string | undefined;
  apiKey?: string | undefined;
};

export default async function runPostgrestQuery(
  query: string,
  options?: RunPostgrestQueryOptions
): Promise<unknown[]> {
  // 현재 select만 지원함
  const url = `${options?.endpointURL ?? SUPABASE_URL}/${query}`;
  // console.log('url', url);
  const apiKey = options?.apiKey ?? SUPABASE_ANON_KEY;
  const headers = { apiKey, Authorization: `Bearer ${apiKey}` };
  const res = await fetch(url, { headers });
  return (await res.json()) as unknown[];
}
