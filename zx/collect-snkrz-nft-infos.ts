#!/usr/bin/env -S pnpm ts-node
import 'zx/globals';
import axios from 'axios';

$.verbose = false;
const jsonPath = `${__dirname}/data/snkrz-nft-infos.tmp.json`;

void (async function () {
  const nftInfos = await fetchFromUrl(50);
  console.log('nftInfos.length:', nftInfos.length);
  await fs.writeJSON(jsonPath, nftInfos, { spaces: 2 });
})();

async function fetchFromUrl(limit: number) {
  const p = new Array(limit).fill(null).map((_, tokenId) => {
    return new Promise((resolve, _) => {
      const targetUrl = `https://metadata.thesnkrz.io/box/${tokenId + 1}.json`;
      axios.get(targetUrl).then((result) => {
        resolve(result.data);
      });
    });
  });

  return await Promise.all(p);
}
