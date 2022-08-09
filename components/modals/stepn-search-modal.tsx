import React from 'react';
import ModalContainer from './modal-container';
import { useEffect, useRef, useState } from 'react';
import { useFilter } from '../../hooks/useFilter';
import { tw } from 'twind';
import NftSearchPanelCategory from '../nft-search-panel-category';
import IconButton from '../icon-button';
import { CgClose } from 'react-icons/cg';
// import { getTrackBackground, Range } from 'react-range';
import { useQuery } from '../../hooks/useQuery';
import type { ModalComponent } from 'hooks/useModal';

interface SearchModalProps {
  onClose: () => void;
}

export type TabName = 'Basic' | 'Appearance' | 'Properties';

const SearchModal: ModalComponent<SearchModalProps> = ({ onClose }) => {
  const tabNames = ['Basic', 'Appearance', 'Properties'] as TabName[];
  const [tabName, setTabName] = useState<TabName>('Properties');
  const { filter, resetAllFilter } = useFilter();
  const modal = useRef<HTMLDivElement>(null);
  const { data, fetchAndClearPrevious } = useQuery();

  const handleReset = () => {
    resetAllFilter();
  };

  const setAnimation = (element: HTMLDivElement) => {
    element.style.transition = `top 500ms cubic-bezier(0.25, 1, 0.5, 1)`;
    setTimeout(() => (element.style.top = '50%'));
    element.addEventListener(
      'transitionend',
      () => (element.style.transition = ''),
      { once: true }
    );
  };

  useEffect(() => {
    const modalElement = modal.current;
    if (modalElement) {
      setAnimation(modalElement);
    }
  }, []);

  return (
    <ModalContainer onDimClick={onClose}>
      <div
        ref={modal}
        className={tw`
        w-[1024px] h-[720px] rounded-xl
        absolute top-[100%] left-[50%] -translate-x-1/2 -translate-y-1/2
        overflow-hidden flex flex-row items-stretch
      `}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={tw`bg-primary-50 flex flex-col w-48 p-6`}>
          <div className={tw`font-bold text-2xl text-primary-800 mb-6`}>
            Search
          </div>
          {tabNames.map((item, index) => {
            return (
              <div
                key={index}
                className={tw`
                font-bold text-lg py-1
                hover:cursor-pointer
                ${item === tabName ? 'text-accent' : 'text-primary-300'}
              `}
                onClick={() => setTabName(item)}
              >
                <NftSearchPanelCategory name={item} />
              </div>
            );
          })}
        </div>
        <div className={tw`bg-white flex-1 flex flex-col items-stretch`}>
          <div className={tw`flex flex-row justify-end pt-4 pr-4`}>
            <IconButton
              className={tw`bg-opacity-0`}
              icon={<CgClose />}
              onClick={() => onClose()}
            ></IconButton>
          </div>
          <div className={tw`flex-1`}>
            {tabName === 'Basic' && <BasicTab />}
            {tabName === 'Appearance' && <AppearanceTab />}
            {tabName === 'Properties' && <PropertiesTab />}
          </div>
          <div
            className={tw`
            flex flex-row justify-end items-center
            gap-4 pr-6 pb-6
          `}
          >
            <p
              className={tw`
              font-bold text-primary-400`}
            >
              {(data.expectedTotalCount ?? data.totalCount).toLocaleString()}
              items
            </p>
            <button
              className={tw`
              before:content-['aaa']
              bg-accent rounded-lg focus:outline-none
              text-white font-bold w-24 h-10
            `}
              onClick={() => {
                void fetchAndClearPrevious({
                  viewName: data.viewName,
                  filter,
                  order: data.order ?? '',
                });
                onClose();
              }}
            >
              Apply
            </button>
            <button
              className={tw`
              rounded-lg focus:outline-none
              border-solid border-1 border-primary-800
              text-primary-800 font-bold w-24 h-10
            `}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default SearchModal;

function BasicTab() {
  return <div className={tw`w-full h-full bg-red-50`}></div>;
}

function AppearanceTab() {
  return <div className={tw`w-full h-full bg-green-50`}></div>;
}

function PropertiesTab() {
  return <div className={tw`w-full h-full bg-blue-50`}></div>;
}
