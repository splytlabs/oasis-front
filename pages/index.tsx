import type { NextPage } from 'next';
import Head from 'next/head';
import { tw } from 'twind';
import AppHeader from 'components/app-header';
import IconButton from 'components/icon-button';
import { FiHeart, FiSearch, FiShare2 } from 'react-icons/fi';
import { MetricsBar } from 'components/metrics-bar';
import PostgrestInfiniteScroll from 'components/postgrest-infinite-scroll';
import NFTCard from 'components/nft-card';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Modals, useModals } from '../hooks/useModal';
import SearchModal from '../components/modals/SearchModal';
import { useQuery } from '../hooks/useQuery';

const queryHead = '/rest/v1/rental_infos_view?select=';

const Home: NextPage = () => {
  const { openModal } = useModals();
  const { fetch } = useQuery();

  const [searchQuery, setSearchQuery] = useState(queryHead + '*');
  const cardWidth = 300;

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const handleApplySearchQuery = (query: string) => {
    if (query.startsWith(queryHead)) {
      console.info('Updated Query:', query);
      setSearchQuery(query);
    } else {
      console.error('Invalid Query:', query);
    }
  };

  const handleOpenSearchModal = () => {
    openModal(SearchModal, { onApply: handleApplySearchQuery });
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Game NFT Search Demo</title>
      </Head>
      <main
        id={'main'}
        className={tw`
        w-[100%] h-[100%]
        absolute top-0 left-0
        overflow-scroll
        flex flex-col items-center`}
      >
        <AppHeader>
          <div className={tw`font-bold text-accent px-4`}>Rent</div>
          <div className={tw`border-l-1 w-auto h-4 border-primary-300`}></div>
          <div className={tw`font-bold text-primary-500 px-4`}>Lend</div>
        </AppHeader>
        <div
          className={tw`
            font-bold text-5xl text-primary-800 mt-12 mb-4
          `}
        >
          Derby Stars
        </div>
        <div className={tw`flex flex-row justify-center gap-6 my-2`}>
          <IconButton icon={<FiSearch />} onClick={handleOpenSearchModal} />
          <IconButton icon={<FiShare2 />} />
          <IconButton icon={<FiHeart />} />
        </div>
        <MetricsBar
          className={tw`mt-8 mb-12`}
          entries={[
            { label: 'FLOOR PRICE', value: '$56.1K' },
            { label: 'HIGHEST SALE', value: '$756.1K' },
            { label: 'TOTAL VOLUME', value: '$356.2M' },
            { label: 'ITEMS', value: '$10K' },
            { label: 'OWNERS', value: '$1.2K' },
            { label: 'MARKET CAP', value: '$456.6K' },
          ]}
        />
        <PostgrestInfiniteScroll
          query={searchQuery}
          limit={12}
          className={tw`
            w-full max-w-[1440px] flex flex-row flex-wrap justify-center gap-8
          `}
          onRenderItem={(item) => {
            const row = item as { [key: string]: string };
            return (
              <NFTCard
                key={row.id}
                width={cardWidth}
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
      </main>
      <Modals />
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
