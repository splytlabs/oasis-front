// 주의!!! 내부 스크립트 안에서만 사용하세요
const { Client } = require('pg');

const sql = async function (query) {
  // prettier-ignore
  const client = new Client({
    host     : 'db.ltfdhwvztsqsskvggemu.supabase.co',
    database : 'postgres',
    port     : 5432,
    user     : 'postgres',
    password : 'gTFOyEZaCwZS3O5o',
  });

  await client.connect();
  try {
    return await client.query(query);
  } finally {
    await client.end();
  }
};

export default sql;
