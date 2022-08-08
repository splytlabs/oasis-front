import { tw } from 'twind';
import IconButton from './icon-button';
import FilterButton from './filterbutton';
import { useModals } from '../hooks/useModal';
import SearchModal from './modals/search-modal';
import { useQuery } from '../hooks/useQuery';
import Image from 'next/image';
import { BsSortDown, BsSortDownAlt } from 'react-icons/bs';

type NftListHeaderProps = {
  collection: {
    name: string;
    imgUrl: string;
  };
};

const NftListHeader = ({ collection }: NftListHeaderProps) => {
  const { data, setOrder } = useQuery();
  const { openModal } = useModals();

  const handleSortToggleClick = () => {
    if (data.order) {
      setOrder('');
    } else {
      setOrder('price.asc.nullslast');
    }
  };

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
          <FilterButton onClick={() => openModal(SearchModal, {})} />
          <p
            className={tw`
              flex flex-row items-center
              ml-[16px] hover:cursor-pointer
            `}
            onClick={handleSortToggleClick}
          >
            {data.order ? <BsSortDownAlt /> : <BsSortDown />}
            <span
              className={tw`
              text-[14px]
              text-[#1C2541]
              font-bold
              ml-[4px]
            `}
            >
              Sort by Price
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NftListHeader;
