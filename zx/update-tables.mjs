#!/usr/bin/env -S pnpm zx
import 'zx/globals';
import { createClient } from '@supabase/supabase-js';

$.verbose = false;

const SUPABASE_URL = 'https://ltfdhwvztsqsskvggemu.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZmRod3Z6dHNxc3NrdmdnZW11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1Nzk3NTUwOCwiZXhwIjoxOTczNTUxNTA4fQ.0KD12T1nZuAjxa9kKO3zBw_mZEGEAPrnkiYZD_2vcJ8';

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

/** @type { object[] } */
const nftInfos = await fs.readJSON(`${__dirname}/nft-infos-10027.json`);
console.log('nftInfos.length', nftInfos.length);
const rows = [];
for (const rawData of nftInfos) {
  const traits = {};
  for (const attr of rawData.extension.attributes) {
    traits[attr.trait_type] = attr.value;
  }
  const nftInfo = {
    contract_address: 'terra1ca9peph7c20eqr9cns2vhn6sp6cp7vv4jnzjrc',
    token_id: rawData.extension.name.split('#')[1],
    token_uri: rawData.token_uri,
    image: rawData.extension.image,
    external_url: rawData.extension.external_url,
    name: rawData.extension.name,
    ...traits,
  };
  rows.push(nftInfo);
}

const chunkSize = 100;
for (let i = 0; i < rows.length; i += chunkSize) {
  const chunk = rows.slice(i, i + chunkSize);
  const result = await client.from('nft_infos').insert(chunk).then();
  console.log(`[${i} - ${i + chunk.length}] insert result:`, result.statusText);
}
