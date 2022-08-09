#!/usr/bin/env -S pnpm ts-node
import 'zx/globals';
import { firefox } from 'playwright';

$.verbose = false;
const jsonPath = `${__dirname}/data/stepn-nft-infos.tmp.json`;

void (async function () {
  const nftInfos = await fetchFromMagicEden(10000);
  console.log('nftInfos.length:', nftInfos.length);
  await fs.writeJSON(jsonPath, nftInfos, { spaces: 2 });
})();

async function fetchFromMagicEden(count: number) {
  const limit = 100;
  const data = [] as Record<string, unknown>[];
  while (data.length < count) {
    console.log('sendQuery:', `skip:${data.length}, limit:${limit}`);
    const results = await sendQuery(data.length, limit);
    if (!results.length) {
      break;
    }
    data.push(...results);
  }
  return data;
}

async function sendQuery(skip: number, limit: number) {
  const url = makeQueryURL(skip, limit);
  const browser = await firefox.launch({ timeout: 60_000 });
  const page = await browser.newPage();
  await page.goto(url);
  // await page.waitForTimeout(10_000);
  // await page.screenshot({ path: './query-result.png' });
  const json = (await page.locator('pre').textContent()) ?? '[]';
  await browser.close();
  return JSON.parse(json).results ?? [];
}

function makeQueryURL(skip: number, limit: number) {
  return `
    https://api-mainnet.magiceden.io/rpc/getListedNFTsByQueryLite?q={
      "$match":{"$and":[
        {"collectionSymbol":"stepn"},
        {"title":{"$regex":"^Sneaker"}}
      ]},
      "$sort":{"createdAt":-1},
      "$skip":${skip || 0},"$limit":${limit || 1},
      "status":[]
    }
  `.replaceAll(/\s/g, '');
}
