#!/usr/bin/env -S pnpm ts-node
// @ts-nocheck
import 'zx/globals';
import { LCDClient } from '@terra-money/terra.js';
import axios from 'axios';

axios.defaults.timeout = 60000;

void (async function () {
  try {
    const { count: numTokens } = await runContractQuery({ num_tokens: {} });
    const nftInfos = [];
    const limit = 20;
    let startAfter = undefined;
    let tokenIds = [];

    do {
      /** @type {string[]} */
      tokenIds = await fetchTokenIds({ limit, startAfter });
      nftInfos.push(
        ...(await Promise.all(tokenIds.map((x) => fetchNFTInfo(x))))
      );
      console.log(
        `${tokenIds.length} NFT-Infos fetched. ${nftInfos.length}/${numTokens}`
      );
      startAfter = tokenIds[tokenIds.length - 1];
    } while (tokenIds.length >= limit);

    console.log('NFT-Infos -> nft-infos.json');
    await fs.writeJSON(`${__dirname}/nft-infos.json`, nftInfos, { spaces: 2 });
    console.log(`All NFT-Infos collected.`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('AxiosError:', error.message);
    } else {
      throw error;
    }
  }
})();

/**
 * @async
 * @param {{startAfter?: string, limit?: number}} options
 * @return {Promise<string[]>}
 */
async function fetchTokenIds(options) {
  return (
    (
      await runContractQuery({
        all_tokens: {
          start_after: options.startAfter,
          limit: options.limit,
        },
      })
    ).tokens ?? []
  );
}

/**
 * @async
 * @param {string} tokenId
 * @return {Promise<object>}
 */
async function fetchNFTInfo(tokenId) {
  return await runContractQuery({
    nft_info: {
      token_id: tokenId,
    },
  });
}

/**
 * @async
 * @param {string | object} query
 * @return {Promise<any>}
 */
async function runContractQuery(query) {
  const lcd = new LCDClient({
    chainID: 'columbus-5',
    URL: 'https://blockdaemon-terra-lcd.api.bdnodes.net:1317',
  });
  const addr = 'terra1ca9peph7c20eqr9cns2vhn6sp6cp7vv4jnzjrc';
  return await lcd.wasm.contractQuery(addr, query);
}
