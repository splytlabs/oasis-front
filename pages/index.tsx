import type { NextPage } from 'next';
import { tw } from 'twind';
import PostgrestInfiniteScroll from 'components/postgrest-infinite-scroll';
import NFTCard from 'components/nft-card';
import Image from 'next/image';
import { useState, useRef } from 'react';
import NftListHeader from '../components/nft-list-header';
import MainContainer from '../components/layout/main-container';
import HeadTag from '../components/head-tag';

const queryHead = '/rest/v1/rental_infos_view?select=';

const Home: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState(queryHead + '*');
  const cardWidth = 300;

  const handleApplySearchQuery = (query: string) => {
    if (query.startsWith(queryHead)) {
      console.info('Updated Query:', query);
      setSearchQuery(query);
    } else {
      console.error('Invalid Query:', query);
    }
  };

  return (
    <>
      <HeadTag
        title={'The Oasis'}
        url={'splyt.fi'}
        description={'Nft Rental Marketplace'}
        imageUrl={'/splyt-logo'}
      />
      <MainContainer>
        <div
          className={tw`
            w-full max-w-[1440px]
            px-[20px]
          `}
        >
          <NftListHeader
            collection={{ name: 'Derby Stars', imgUrl: '/derby-logo.png' }}
            onModalApply={handleApplySearchQuery}
          />
          <PostgrestInfiniteScroll
            query={searchQuery}
            limit={12}
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
                    contractAddress={row.contract_address ?? ''}
                    tokenId={row.token_id ?? ''}
                    daysMin={Number(row.days_min)}
                    daysMax={Number(row.days_max)}
                    price={Number(row.price)}
                  />
                </NFTCard>
              );
            }}
          >
            <div className={tw`w-[${cardWidth}px]`}></div>
            <div className={tw`w-[${cardWidth}px]`}></div>
            <div className={tw`w-[${cardWidth}px]`}></div>
            <div className={tw`w-[${cardWidth}px]`}></div>
            <div className={tw`w-[${cardWidth}px]`}></div>
          </PostgrestInfiniteScroll>
        </div>
      </MainContainer>
    </>
  );
};

type NFTCardContentProps = {
  contractAddress: string;
  tokenId: string;
  daysMin: number;
  daysMax: number;
  price: number;
};

function NFTCardContent({
  contractAddress,
  tokenId,
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
          href={`/${contractAddress}@${tokenId}`}
          target="_blank"
          rel="noopener noreferrer"
        ></a>
        <Image
          src="/polygon-icon.png"
          alt="polygon-icon"
          width={24}
          height={24}
        ></Image>
        <div className={tw`font-bold text-2xl pl-1 pr-[1px]`}>
          {`${Math.floor(price / 10_000_000)}`}
        </div>
        <div className={tw`font-bold text-lg relative top-[1px]`}>/Day</div>
      </button>
      <div className={tw`h-8`}></div>
    </>
  );
}

export default Home;
