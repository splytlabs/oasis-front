#!/usr/bin/env -S pnpm ts-node
import 'zx/globals';
import dedent from 'ts-dedent';
import sql from './lib/sql';
import supabase from './lib/supabase';

$.verbose = false;
const jsonPath = `${__dirname}/data/snkrz-nft-infos.json`;

const DDL_VERSION = 0;

void (async function () {
  await dropTables();
  console.log('drop');
  const ddl = createDDL();
  const ddlResult = await sql(ddl);
  console.log('ddlResult', ddlResult);
  const rawData = await fs.readJSON(jsonPath);
  await insertNFTInfos(rawData);
  await insertRentalInfos(rawData);
})();

async function insertRows(tableName: string, rows: unknown[], chunkSize = 100) {
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

const propertyList = [
  'Rarity',
  'Level',
  'Performance',
  'Luck',
  'Tenacity',
  'Quality',
  'Fever',
];

async function insertNFTInfos(rawData: Record<string, unknown>[]) {
  const { nftInfos } = tableNames();
  const rows = [] as unknown[];
  for (const [i, info] of rawData.entries()) {
    const attrs = {} as Record<string, unknown>;
    (info.attributes as unknown[]).forEach((x) => {
      const attr = x as Record<string, string>;
      if (!attr.trait_type || !propertyList.includes(attr.trait_type)) {
        return;
      }
      let value = attr.value ?? null;
      attrs[attr.trait_type] = value;
    });
    const row = {
      token_uid: i + 1,
      image: info.image,
      name: info.name,
      ...attrs,
    };
    rows.push(row);
  }
  await insertRows(nftInfos, rows);
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

async function insertRentalInfos(rawData: Record<string, unknown>[]) {
  const { rentalInfos } = tableNames();
  const rows = [] as unknown[];
  for (const [i, info] of rawData.entries()) {
    const row = {
      token_uid: i + 1,
      owner: '1ca9peph7c20eqr9cns2vhn6sp6cp7vv4jnzjrc',
      days_min: 1,
      days_max: 7,
      share_ratio: getRandomInt(30, 50),
    };
    rows.push(row);
  }
  await insertRows(rentalInfos, rows);
}

function tableNames() {
  const prefix = 'snkrz_';
  const suffix = !DDL_VERSION ? '' : `_${Math.floor(Math.abs(DDL_VERSION))}`;
  return {
    nftInfos: `${prefix}nft_infos${suffix}`,
    rentalInfos: `${prefix}rental_infos${suffix}`,
  };
}

async function dropTables() {
  const { nftInfos, rentalInfos } = tableNames();
  try {
    await sql(`
      DROP VIEW ${rentalInfos}_view;
      DROP TABLE ${rentalInfos};
      DROP TABLE ${nftInfos};
    `);
  } catch {}
}

function createDDL() {
  const { nftInfos, rentalInfos } = tableNames();

  return dedent`
    CREATE TABLE ${nftInfos}
    (
      id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
      token_uid integer NOT NULL,
      image varchar NOT NULL,
      name varchar NOT NULL,
      "Rarity" varchar NOT NULL,
      "Level" integer NOT NULL,
      "Performance" numeric NOT NULL,
      "Luck" numeric NOT NULL,
      "Tenacity" numeric NOT NULL,
      "Quality" numeric NOT NULL,
      "Fever" numeric NOT NULL,
      CONSTRAINT ${nftInfos}_pkey PRIMARY KEY (id),
      CONSTRAINT ${rentalInfos}_token_uid_key UNIQUE (token_uid)
    );
    CREATE TABLE ${rentalInfos}
    (
      id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
      token_uid integer NOT NULL,
      owner varchar NOT NULL,
      days_min integer NOT NULL,
      days_max integer NOT NULL,
      share_ratio integer NOT NULL,
      CONSTRAINT ${rentalInfos}_pkey PRIMARY KEY (id),
      CONSTRAINT ${rentalInfos}_token_uid_fkey
      FOREIGN KEY (token_uid) REFERENCES ${nftInfos} (token_uid)
    );
    ${createTablePolicy(nftInfos)}
    ${createTablePolicy(rentalInfos)}
    CREATE OR REPLACE VIEW ${rentalInfos}_view
    AS SELECT ${nftInfos}.*,
      ${rentalInfos}.owner,
      ${rentalInfos}.days_min,
      ${rentalInfos}.days_max,
      ${rentalInfos}.share_ratio
    FROM ${nftInfos} LEFT JOIN ${rentalInfos}
    ON ${nftInfos}.token_uid = ${rentalInfos}.token_uid;
  `;
}

function createTablePolicy(tableName: string) {
  return dedent`
    ALTER TABLE IF EXISTS ${tableName}
        ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Enable read access for all users"
        ON ${tableName}
        AS PERMISSIVE
        FOR SELECT
        TO public
        USING (true);

  `;
}
