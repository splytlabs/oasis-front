import type { NextPage, GetServerSidePropsResult } from 'next';
import { tw } from 'twind';
import PostgrestInfiniteScroll from 'components/postgrest-infinite-scroll';
import NFTCard from 'components/nft-card';
import Img from 'components/img';
import { useEffect, useRef } from 'react';
import HeadTag from 'components/head-tag';
import MainContainer from 'components/layout/main-container';
import NftListHeader from 'components/nft-list-header';
import { useQuery } from 'hooks/useQuery';
import SearchModal from 'components/modals/derbystars-search-modal';

const Home: NextPage = () => {
  const detailsBaseURL = '/collection/derbystars/';
  const fetchLimit = 20;
  const { setViewName } = useQuery();

  useEffect(() => {
    setViewName('derbystars_rental_infos_view');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeadTag
        title={'The SPLYT Marketplace'}
        url={'splyt.fi'}
        description={'NFT Rental Marketplace'}
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
            collection={{ name: 'Derby Stars', imgUrl: '/derby-logo.png' }}
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
              return (
                <NFTCard
                  key={row.id}
                  name={row.name ?? ''}
                  image={row.image ?? ''}
                >
                  <NFTCardContent
                    baseURL={detailsBaseURL}
                    nftUniqueKey={row.token_uid ?? ''}
                    daysMin={Number(row.days_min)}
                    daysMax={Number(row.days_max)}
                    price={Number(row.price)}
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
};

function NFTCardContent({
  baseURL,
  nftUniqueKey,
  daysMin,
  daysMax,
  price,
}: NFTCardContentProps) {
  const aRef = useRef<HTMLAnchorElement>(null);
  const handleRentButtonClick = () => {
    aRef.current?.click();
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
      <button
        className={tw`
          w-full h-12 bg-accent rounded-full flex flex-row
          justify-center items-center text-white pr-2
        `}
        onClick={handleRentButtonClick}
      >
        <a
          ref={aRef}
          className={tw`hidden`}
          href={`${baseURL}${nftUniqueKey.slice(5)}`}
          target="_blank"
          rel="noopener noreferrer"
        ></a>
        <Img className={tw`w-[24px] h-[24px]`} src="/polygon-icon.svg"></Img>
        <div className={tw`font-bold text-2xl pl-1 pr-[1px]`}>
          {`${Math.floor(price / 1_000_000)}`}
        </div>
        <div className={tw`font-bold text-lg relative top-[1px]`}>/Day</div>
      </button>
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
