// 주의!!! 내부 스크립트 안에서만 사용하세요
import './supabase.env';
const { Client } = require('pg');

export default async function sql(query: string) {
  // prettier-ignore
  const client = new Client({
    host     : 'db.ltfdhwvztsqsskvggemu.supabase.co',
    database : 'postgres',
    port     : 5432,
    user     : 'postgres',
    password : process.env.SUPABASE_DB_PW ?? '',
  });

  await client.connect();
  try {
    return await client.query(query);
  } finally {
    await client.end();
  }
}
