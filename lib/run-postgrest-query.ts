import { fetch } from 'cross-fetch';

const SUPABASE_URL = 'https://ltfdhwvztsqsskvggemu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZmRod3Z6dHNxc3NrdmdnZW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc5NzU1MDgsImV4cCI6MTk3MzU1MTUwOH0.nvrndu77J1HyW16IlWTWTGSJDAwfXd_jzBgTersXA5U';

export type RunPostgrestQueryOptions = {
  endpointURL?: string | undefined;
  apiKey?: string | undefined;
  count?: 'exact' | 'planned' | 'estimated';
  method?: 'GET' | 'HEAD';
};

export type RunPostgrestQueryResult = {
  items: unknown[];
  nextOffset?: number;
  totalCount?: number;
};

export default async function runPostgrestQuery(
  query: string,
  options?: RunPostgrestQueryOptions
): Promise<RunPostgrestQueryResult> {
  // 현재 select만 지원함
  const url = `${options?.endpointURL ?? SUPABASE_URL}/${query}`;
  const apiKey = options?.apiKey ?? SUPABASE_ANON_KEY;
  const headers = {
    apiKey,
    Authorization: `Bearer ${apiKey}`,
  } as Record<string, string>;
  if (options?.count) {
    headers['Prefer'] = `count=${options.count}`;
  }

  const res = await fetch(url, { headers, method: options?.method ?? 'GET' });
  const items = (await res.json()) as unknown[];
  const result = { items } as RunPostgrestQueryResult;
  const range = (res.headers.get('content-range') ?? '').split(/[-/]/);
  const nextOffset = Number.parseInt(range[1] ?? '', 10) + 1;
  const totalCount = Number.parseInt(range[2] ?? '', 10);
  if (!Number.isNaN(nextOffset)) {
    result.nextOffset = nextOffset;
  }
  if (!Number.isNaN(totalCount)) {
    result.totalCount = totalCount;
  }
  return result;
}
