#!/usr/bin/env -S pnpm ts-node
// @ts-nocheck
import 'zx/globals';
import supabase from './lib/supabase';
import { exit } from 'process';

$.verbose = false;
const jsonPath = `${__dirname}/data/derbystars-nft-infos.json`;

void (async function () {
  await insertRows('nft_infos', await loadRowsFromJSON(jsonPath));
  await insertRows('rental_infos', await createRowsFromNFTInfos('nft_infos'));
  exit(0);
})();

async function insertRows(tableName, rows, chunkSize = 100) {
  console.log(`insertRows(${tableName}) started !!`);
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const result = await supabase.from(tableName).insert(chunk).then();
    console.log(
      `[${i} - ${i + chunk.length}] insert result:`,
      result.statusText
    );
  }
  console.log(`insertRows(${tableName}) finished !!`);
}

async function loadRowsFromJSON(jsonPath) {
  /** @type { object[] } */
  const nftInfos = await fs.readJSON(jsonPath);
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
  return rows;
}

async function createRowsFromNFTInfos(tableName) {
  const rows = [];
  let totalRows = 0;
  while (true) {
    const { body: nftInfos } = await client
      .from('nft_infos')
      .select()
      .range(rows.length, rows.length + 99)
      .then();
    for (const nftInfo of nftInfos) {
      rows.push(createRentalInfo(nftInfo));
    }
    console.log('rows.length:', rows.length);
    if (rows.length === totalRows) {
      break;
    }
    totalRows = rows.length;
  }
  return rows;
}

function createRentalInfo(nftInfo) {
  const rarityScores = {
    Common: 1.0,
    'Rare 1': 1.1,
    'Rare 2': 1.2,
    'Rare 3': 1.4,
    'Rare 4': 1.6,
    'Rare 5': 2.0,
    'Rare 6': 2.5,
    'Rare 7': 3.1,
    'Rare 8': 3.7,
    'Rare 9': 4.5,
    Unique: 6,
  };
  const talentScores = [10, 30, 90, 270, 810];
  const r = rarityScores[nftInfo.Rarity] ?? 0;
  const t = [
    talentScores[nftInfo['Talent:FrontRunner']],
    talentScores[nftInfo['Talent:RunawayRunner']],
    talentScores[nftInfo['Talent:Stalker']],
    talentScores[nftInfo['Talent:StretchRunner']],
  ].reduce((v, s) => v + s);
  const x = r * t;

  return {
    nft_info_id: nftInfo.id,
    days_min: x >= 500 ? 1 : x >= 200 ? 3 : 7,
    days_max: x >= 500 ? 7 : x >= 200 ? 14 : 28,
    price: Math.floor(x * 1.2 * 1_000_000),
  };
}
