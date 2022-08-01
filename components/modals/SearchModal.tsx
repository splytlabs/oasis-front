import React from 'react';
import ModalContainer from './ModalContainer';
import { useEffect, useRef, useState } from 'react';
import { useFilter } from '../../hooks/useFilter';
import { tw } from 'twind';
import NftSearchPanelCategory from '../nft-search-panel-category';
import IconButton from '../icon-button';
import { CgClose } from 'react-icons/cg';
import { getTrackBackground, Range } from 'react-range';

interface SearchModalProps {
  onApply?: (query: string) => void;
  onClose: () => void;
}

export type TabName = 'Basic' | 'Appearance' | 'Properties';

const SearchModal: React.FC<SearchModalProps> = ({ onClose, onApply }) => {
  const tabNames = ['Basic', 'Appearance', 'Properties'] as TabName[];
  const [tabName, setTabName] = useState<TabName>('Properties');
  const { getFilterQuery, resetFilter } = useFilter();
  const modal = useRef<HTMLDivElement>(null);

  const buildQuery = () => {
    return getFilterQuery();
  };

  const handleReset = () => {
    resetFilter('properties');
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
            flex flex-row justify-end items-start
            gap-4 pr-6 pb-6
          `}
          >
            <button
              className={tw`
              before:content-['aaa']
              bg-accent rounded-lg focus:outline-none
              text-white font-bold w-24 h-10
            `}
              onClick={() => {
                onApply?.(buildQuery());
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
  const statusNames = ['Speed', 'Power', 'Stamina', 'Grit', 'Intellect'];
  const talentNames = [
    'Runaway Runner',
    'Front Runner',
    'Stalker',
    'Stretch Runner',
  ];

  return (
    <div className={tw`w-full h-full flex flex-row items-stretch pt-8 pr-8`}>
      <div className={tw`flex-1 flex flex-col items-center gap-12 px-8`}>
        {statusNames.map((name) => {
          return <StatusRange key={name} name={name} />;
        })}
      </div>
      <div className={tw`mb-16 border-solid border-l-2 border-primary-100`} />
      <div className={tw`flex-1 flex flex-col items-center gap-12 px-8`}>
        {talentNames.map((name) => {
          return <TalentRange key={name} name={name} />;
        })}
      </div>
    </div>
  );
}

type StatusRangeProps = {
  name: string;
};

function StatusRange({ name }: StatusRangeProps) {
  const min = 0;
  const max = 100;
  const { filter, setFilter } = useFilter();

  const handleChange = (values: number[]) => {
    const a = Math.max(values[0] ?? min, min);
    const b = Math.min(values[1] ?? max, max);

    if (a === min && b === max) {
      setFilter('properties', name, '');
    } else {
      setFilter('properties', name, `${name}=gte.${a}&${name}=lte.${b}`);
    }
  };

  const range = () => {
    const values = filter
      .get('properties')
      ?.get(name)
      ?.match(/\.[0-9]+/g)
      ?.map((x) => Number.parseInt(x.substring(1)));
    return [values?.[0] ?? min, values?.[1] ?? max];
  };

  return (
    <RangeBase
      label={name}
      min={0}
      max={100}
      values={range()}
      onChange={handleChange}
    />
  );
}

function TalentRange({ name }: StatusRangeProps) {
  const min = 0;
  const max = 4;
  const enumNames = ['D', 'C', 'B', 'A', 'S'];
  const colName = `Talent:${name.replaceAll(' ', '')}`;
  const { filter, setFilter } = useFilter();

  const handleChange = (values: number[]) => {
    const a = Math.max(values[0] ?? min, min);
    const b = Math.min(values[1] ?? max, max);

    if (a === min && b === max) {
      setFilter('properties', name, '');
    } else {
      setFilter(
        'properties',
        name,
        `"${colName}"=gte.${a}&"${colName}"=lte.${b}`
      );
    }
  };

  const range = () => {
    const values = filter
      .get('properties')
      ?.get(name)
      ?.match(/\.[0-9]+/g)
      ?.map((x) => Number.parseInt(x.substring(1)));
    return [values?.[0] ?? min, values?.[1] ?? max];
  };

  return (
    <RangeBase
      label={name}
      min={0}
      max={4}
      values={range()}
      onChange={handleChange}
      enumNames={enumNames}
    />
  );
}

type RangeBaseProps = {
  label: string;
  min: number;
  max: number;
  values: number[];
  onChange: (values: number[]) => void;
  enumNames?: string[];
};

function RangeBase({
  label,
  values,
  min,
  max,
  onChange,
  enumNames,
}: RangeBaseProps) {
  return (
    <div className={tw`w-full pl-1 pr-4 flex flex-row gap-6 items-center`}>
      <div
        className={tw`
          w-16 h-16 flex-none flex flex-row items-center
          font-bold text-primary-600
        `}
      >
        {label}
      </div>
      <div className={tw`w-full pt-4`}>
        <Range
          min={min}
          max={max}
          step={1}
          values={values}
          onChange={onChange}
          renderTrack={({ props, children }) => {
            return (
              <div
                {...props}
                style={{
                  ...props.style,
                  background: getTrackBackground({
                    values,
                    min,
                    max,
                    colors: ['#E6E9EF', '#4C67F4', '#E6E9EF'],
                  }),
                }}
                className={tw`w-full h-1 rounded-full`}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            return (
              <div
                {...props}
                style={{ ...props.style }}
                className={tw`
                  w-4 h-4 bg-white border-accent border-1 rounded-full
                `}
              >
                <div
                  className={tw`
                    relative -top-5 w-6 -left-1.5 h-4 rounded-sm
                    bg-accent-500 text-white text-xs font-bold text-center
                  `}
                >
                  {!enumNames
                    ? values[props.key]
                    : enumNames[values[props.key] ?? 0] ?? '??'}
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
