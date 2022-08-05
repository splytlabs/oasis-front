import { tw } from 'twind';
import IconButton from './icon-button';
import FilterButton from './filterbutton';
import { useModals } from '../hooks/useModal';
import SearchModal from './modals/search-modal';
import { useQuery } from '../hooks/useQuery';
import Image from 'next/image';
import type { FilterState } from 'hooks/useFilter';

type NftListHeaderProps = {
  collection: {
    name: string;
    imgUrl: string;
  };
  onModalApply: (filter: FilterState) => void;
};

const NftListHeader = ({ onModalApply, collection }: NftListHeaderProps) => {
  const { data } = useQuery();
  const { openModal } = useModals();

  return (
    <div
      className={tw`
        w-full h-[120px] mt-[66px] mb-[40px]
        flex flex-row justify-between items-center
      `}
    >
      <div
        className={tw`
          w-[278px]
          flex flex-row
        `}
      >
        <Image
          src={collection.imgUrl}
          alt={'logo'}
          width={120}
          height={120}
        ></Image>
        <div
          className={tw`
            flex flex-col justify-center gap-6
            ml-[20px]
          `}
        >
          <p
            className={tw`
              text-[24px]
              text-[#393A40]
              font-bold
            `}
          >
            {collection.name}
          </p>
          <div
            className={tw`
              flex flex-row gap-4
            `}
          >
            <IconButton
              icon={
                <Image
                  src={'/share-icon.svg'}
                  alt={'share'}
                  width={22}
                  height={22}
                />
              }
            />
            <IconButton
              icon={
                <Image
                  src={'/web-icon.svg'}
                  alt={'web'}
                  width={24}
                  height={24}
                />
              }
            />
          </div>
        </div>
      </div>
      <div
        className={tw`
          w-[calc(100%-278px)]
          h-[100%]
          flex items-end
        `}
      >
        <div
          className={tw`
          w-[100%]
          flex flex-row justify-end items-center
        `}
        >
          <p
            className={tw`
            text-[14px]
            text-[#1C2541]
            font-bold
            mr-[16px]
          `}
          >
            {data.totalCount.toLocaleString()} items
          </p>
          <FilterButton
            onClick={() => openModal(SearchModal, { onApply: onModalApply })}
          />
          <p
            className={tw`
            flex flex-row items-center
            ml-[16px]
          `}
          >
            <Image
              src={'/sort-icon.svg'}
              alt={'sort'}
              width={16}
              height={16}
            ></Image>
            <span
              className={tw`
              text-[14px]
              text-[#1C2541]
              font-bold
              ml-[4px]
            `}
            >
              Lowest Price
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NftListHeader;
