import type { NextPage, GetServerSidePropsResult } from 'next';
import { tw } from 'twind';
import PostgrestInfiniteScroll from 'components/postgrest-infinite-scroll';
import NFTCard from 'components/nft-card';
import { useEffect } from 'react';
import HeadTag from 'components/head-tag';
import MainContainer from 'components/layout/main-container';
import NftListHeader from 'components/nft-list-header';
import { useQuery } from 'hooks/useQuery';
import SearchModal from 'components/modals/snkrz-search-modal';
import { useMetaMask } from 'metamask-react';
import Img from 'components/img';
import { useRouter } from 'next/router';

const klaytnTestnet = {
  chainId: '0x3e9',

  chainName: 'Klaytn Baobab',
  rpcUrls: ['https://api.baobab.klaytn.net:8651/'],
  nativeCurrency: {
    name: 'KLAY',
    symbol: 'KLAY',
    decimals: 18,
  },
  blockExplorerUrls: ['https://baobab.scope.klaytn.com/'],
};

function secondToDay(sec: number) {
  return Math.round(sec / 60 / 24);
}

function currentTime() {
  return Math.round(Date.now() / 1000);
}

const Home: NextPage = () => {
  const detailsBaseURL = '/collection/snkrz/';
  const fetchLimit = 20;
  const { setViewName } = useQuery();
  const { status, addChain } = useMetaMask();

  useEffect(() => {
    setViewName('snkrz_view');

    if (status === 'connected') {
      void addChain(klaytnTestnet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeadTag
        title={'The SPLYT Marketplace'}
        url={'splyt.fi'}
        description={'Nft Rental Marketplace'}
        imageUrl={'/splyt-logo'}
      />
      <MainContainer>
        <div
          className={tw`
            w-full max-w-[1440px]
            px-[20px] mt-[66px]
          `}
        >
          <NftListHeader
            collection={{
              name: 'SNKRZ',
              imgUrl: '/snkrz-logo.png',
              webUrl: 'http://www.thesnkrz.com/',
              twitterUrl: 'https://www.twitter.com/theSNKRZ',
              discordUrl: 'https://discord.gg/thesnkrz',
            }}
            searchModal={SearchModal}
          />
          <PostgrestInfiniteScroll
            fetchLimit={fetchLimit}
            className={tw`
              w-full
              grid grid-cols-auto gap-10
            `}
            onRenderItem={(item) => {
              const row = item as { [key: string]: string };

              const isRented =
                row.end_at !== undefined
                  ? Number(row.end_at) > currentTime()
                  : false;

              return (
                <NFTCard
                  key={row.id}
                  name={row.name ?? ''}
                  image={row.image ?? ''}
                  isRented={isRented}
                >
                  <NFTCardContent
                    baseURL={detailsBaseURL}
                    nftUniqueKey={row.token_uid ?? ''}
                    daysMin={secondToDay(Number(row.min_rent_duration))}
                    daysMax={secondToDay(Number(row.max_rent_duration))}
                    price={Number(row.payment)}
                    isRented={isRented}
                  />
                </NFTCard>
              );
            }}
          ></PostgrestInfiniteScroll>
        </div>
      </MainContainer>
    </>
  );
};

type NFTCardContentProps = {
  baseURL: string;
  nftUniqueKey: string;
  daysMin: number;
  daysMax: number;
  price: number;
  isRented: boolean;
};

function NFTCardContent({
  baseURL,
  nftUniqueKey,
  daysMin,
  daysMax,
  price,
  isRented,
}: NFTCardContentProps) {
  const router = useRouter();

  const handleRentButtonClick = () => {
    if (!isRented) void router.push(`${baseURL}${nftUniqueKey}`);
  };

  return (
    <>
      <div className={tw`w-full flex flex-row items-center px-1 py-4`}>
        <div className={tw`text-sm text-primary-700`}>Rental Period</div>
        <div className={tw`flex-1`}></div>
        <div className={tw`font-bold text-lg text-primary-700 pr-[1px]`}>
          {`${daysMin}~${daysMax}`}
        </div>
        <div className={tw`text-sm text-primary-700 relative top-[2px]`}>
          /Days
        </div>
      </div>
      {isRented ? (
        <button
          disabled
          className={tw`
          w-full h-12 rounded-full flex flex-row bg-primary-600
          justify-center items-center text-white pr-2 cursor-not-allowed
        `}
        >
          <div className={tw`font-bold text-lg relative top-[1px]`}>Rented</div>
        </button>
      ) : (
        <button
          className={tw`
          w-full h-12 bg-accent rounded-full flex flex-row
          justify-center items-center text-white pr-2
        `}
          onClick={handleRentButtonClick}
        >
          <Img className={tw`w-[24px] h-[24px]`} src="/klay-icon.svg"></Img>
          <div
            className={tw`font-bold text-2xl pl-1 pr-[1px]`}
          >{`${price}`}</div>
          <div className={tw`font-bold text-lg relative top-[1px]`}>/Day</div>
        </button>
      )}

      <div className={tw`h-8`}></div>
    </>
  );
}

export default Home;

export function getServerSideProps(): GetServerSidePropsResult<
  Record<string, unknown>
> {
  return {
    props: {},
  };
}
