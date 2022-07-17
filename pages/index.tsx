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
import { useState } from 'react';
import NFTSearchPanel from 'components/nft-search-panel';

const Home: NextPage = () => {
  const cardWidth = 300;
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleOpenSearchModal = () => {
    setSearchModalOpen(true);
  };
  const handleCloseSearchModal = () => {
    setSearchModalOpen(false);
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Game NFT Search Demo</title>
      </Head>
      <main className={tw`min-h-screen flex flex-col items-center`}>
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
        {searchModalOpen && (
          <div
            className={tw`
              fixed w-screen h-screen z-20 bg-black bg-opacity-50
              flex flex-col justify-center items-center
            `}
            onClick={handleCloseSearchModal}
          >
            <NFTSearchPanel></NFTSearchPanel>
          </div>
        )}
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
          query="/rest/v1/nft_infos?select=id,name,image"
          limit={20}
          className={tw`
            w-full max-w-[1440px] flex flex-row flex-wrap justify-center gap-8
          `}
          onRenderItem={(item) => {
            const row = item as { id: string; name: string; image: string };
            return (
              <NFTCard
                key={row.id}
                width={cardWidth}
                name={row.name}
                image={row.image}
              >
                <DummyNFTCardContent />
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
    </>
  );
};

function DummyNFTCardContent() {
  return (
    <>
      <div className={tw`w-full flex flex-row items-center px-1 py-4`}>
        <div className={tw`text-sm text-primary-700`}>Rental Period</div>
        <div className={tw`flex-1`}></div>
        <div className={tw`font-bold text-lg text-primary-700 pr-[1px]`}>
          3~9
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
      >
        <Image
          src="/polygon-icon.png"
          alt="polygon-icon"
          width={24}
          height={24}
        ></Image>
        <div className={tw`font-bold text-2xl pl-1 pr-[1px]`}>10</div>
        <div className={tw`font-bold text-lg relative top-[1px]`}>/Day</div>
      </button>
      <div className={tw`h-8`}></div>
    </>
  );
}

export default Home;
