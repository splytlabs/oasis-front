import { Contract, ethers } from 'ethers';
import MarketContract from './market.json';

export const MARKET_CONTRACT_ADDRESS =
  '0x0997d2d5cE4bA4036B396fd1b2cceFbF4BeA8Ec2';

export const contractFactory = (
  metamask: ethers.providers.ExternalProvider
) => {
  const provider = new ethers.providers.Web3Provider(metamask, 'any');
  const signer = provider.getSigner();

  return new Contract(
    MARKET_CONTRACT_ADDRESS,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (MarketContract as any).abi,
    signer
  );
};
