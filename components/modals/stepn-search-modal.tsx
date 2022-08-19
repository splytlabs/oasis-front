import React from 'react';
import ModalContainer from './modal-container';
import { useEffect, useRef, useState } from 'react';
import { FilterState, useFilter } from '../../hooks/useFilter';
import { tw } from 'twind';
import NftSearchPanelCategory from '../nft-search-panel-category';
import IconButton from '../icon-button';
import { CgClose } from 'react-icons/cg';
import { getTrackBackground, Range } from 'react-range';
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
  return (
    <div className={tw`w-full h-full flex flex-row items-stretch pt-8 pr-8`}>
      <div className={tw`flex-1 flex flex-col items-center gap-12 px-8`}>
        <SneakerTypeSelect />
        <SneakerQualityRange />
        <OptimalSpeedRange />
        <LevelRange />
        <ShoeMintingCountRange />
      </div>
      <div className={tw`mb-16 border-solid border-l-2 border-primary-100`} />
      <div className={tw`flex-1 flex flex-col items-center gap-12 px-8`}>
        <EfficiencyRange />
        <LuckRange />
        <ComfortabilityRange />
        <ResilienceRange />
        <DurabilityRange />
      </div>
    </div>
  );
}
/**
 * Sneaker type => Walker, Runner, Trainer, Jogger
 * Sneaker quality => Common, Uncommon, Rare, Epic, Legendary
 * Optimal Speed => [1, 20]
 * Level => integer 1 ~ 30
 * Shoe-minting Count => 0/7 ~ 7/7
 *
 * Efficiency => 1 ~ 170
 * Luck => 1 ~ 31
 * Comfortability => 1 ~ 65
 * Resilience => 1 ~ 45
 * Durability => 0/100 ~ 100/100
 */

function SneakerTypeSelect() {
  const { filter, setFilter } = useFilter();
  const label = 'Sneaker Type';
  const name = 'Sneaker type';
  const types = new Map<string, boolean>(
    ['Walker', 'Jogger', 'Runner', 'Trainer'].map((x) => [x, false])
  );
  const category = 'properties';
  const filterValue = filter.get(category)?.get(name);
  if (!filterValue) {
    types.forEach((_, key) => types.set(key, true));
  } else {
    filterValue
      .match(/[(,]\w+/g)
      ?.forEach((x) => types.set(x.substring(1), true));
  }

  const handleTypeChecked = (type: string, checked: boolean) => {
    types.set(type, checked);
    const checkedTypes = Array.from(types.entries())
      .filter(([_, v]) => v)
      .map((x) => x[0])
      .join(',');
    setFilter(category, name, `"${name}"=in.(${checkedTypes})`);
  };

  return (
    <div className={tw`w-full pl-1 pr-4 flex flex-row gap-6 items-center`}>
      <div className={tw`flex-none h-16 flex flex-row items-center`}>
        <div className={tw`w-20 font-bold text-primary-600`}>{label}</div>
      </div>
      <div className={tw`flex flex-row items-center flex-wrap gap-2`}>
        {Array.from(types.entries()).map(([type, checked]) => (
          <div key={type} className={tw`flex flex-row gap-1`}>
            <input
              type="checkbox"
              onChange={(event) => {
                handleTypeChecked(type, event.target.checked);
              }}
              checked={checked}
            />
            <div className={tw`text-sm font-bold text-primary-600`}>{type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SneakerQualityRange() {
  const quality = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const { filter, setFilter } = useFilter();
  const options: SetRangeFilterOptions = {
    min: 0,
    max: quality.length - 1,
    name: 'Sneaker quality',
    filterSetter: setFilter,
  };
  return (
    <RangeBase
      label={'Sneaker Quality'}
      min={options.min}
      max={options.max}
      values={getFilterRange(filter, options)}
      onChange={(values) => setRangeFilter(values, options)}
      valueToString={(value) => quality[value] ?? '???'}
    />
  );
}

function OptimalSpeedRange() {
  const { filter, setFilter } = useFilter();
  const min = 1;
  const max = 20;
  const name = 'Optimal Speed';

  const getFilterRange = () => {
    const category = 'properties';
    const values = filter
      .get(category)
      ?.get(name)
      ?.match(/[[,][0-9]+/g)
      ?.map((x) => Number.parseInt(x.substring(1)));
    return [values?.[0] ?? min, values?.[1] ?? max];
  };

  const setRangeFilter = (values: number[]) => {
    const category = 'properties';
    const a = Math.max(values[0] ?? min, min);
    const b = Math.min(values[1] ?? max, max);

    if (a === min && b === max) {
      setFilter(category, name, '');
    } else {
      setFilter(category, name, `"${name}"=cd.[${a},${b}]`);
    }
  };

  return (
    <RangeBase
      label={name}
      min={min}
      max={max}
      values={getFilterRange()}
      onChange={setRangeFilter}
    />
  );
}

type SetRangeFilterOptions = {
  min: number;
  max: number;
  name: string;
  filterSetter: (category: string, name: string, value: string) => void;
};

function setRangeFilter(values: number[], options: SetRangeFilterOptions) {
  const { min, max, name, filterSetter } = options;
  const category = 'properties';
  const a = Math.max(values[0] ?? min, min);
  const b = Math.min(values[1] ?? max, max);

  if (a === min && b === max) {
    filterSetter(category, name, '');
  } else {
    filterSetter(category, name, `"${name}"=gte.${a}&"${name}"=lte.${b}`);
  }
}

type GetFilterRangeOptions = Pick<
  SetRangeFilterOptions,
  'min' | 'max' | 'name'
>;

function getFilterRange(filter: FilterState, options: GetFilterRangeOptions) {
  const { min, max, name } = options;
  const category = 'properties';
  const values = filter
    .get(category)
    ?.get(name)
    ?.match(/\.[0-9]+/g)
    ?.map((x) => Number.parseInt(x.substring(1)));
  return [values?.[0] ?? min, values?.[1] ?? max];
}

function LevelRange() {
  const { filter, setFilter } = useFilter();
  const options: SetRangeFilterOptions = {
    min: 1,
    max: 30,
    name: 'Level',
    filterSetter: setFilter,
  };
  return (
    <RangeBase
      label={options.name}
      min={options.min}
      max={options.max}
      values={getFilterRange(filter, options)}
      onChange={(values) => setRangeFilter(values, options)}
    />
  );
}

function ShoeMintingCountRange() {
  const { filter, setFilter } = useFilter();
  const options: SetRangeFilterOptions = {
    min: 0,
    max: 7,
    name: 'Shoe-minting Count',
    filterSetter: setFilter,
  };
  return (
    <RangeBase
      label={'Minting Count'}
      min={options.min}
      max={options.max}
      values={getFilterRange(filter, options)}
      onChange={(values) => setRangeFilter(values, options)}
    />
  );
}

function EfficiencyRange() {
  const { filter, setFilter } = useFilter();
  const options: SetRangeFilterOptions = {
    min: 1,
    max: 170,
    name: 'Efficiency',
    filterSetter: setFilter,
  };
  return (
    <RangeBase
      label={options.name}
      min={options.min}
      max={options.max}
      values={getFilterRange(filter, options)}
      onChange={(values) => setRangeFilter(values, options)}
    />
  );
}

function LuckRange() {
  const { filter, setFilter } = useFilter();
  const options: SetRangeFilterOptions = {
    min: 1,
    max: 31,
    name: 'Luck',
    filterSetter: setFilter,
  };
  return (
    <RangeBase
      label={options.name}
      min={options.min}
      max={options.max}
      values={getFilterRange(filter, options)}
      onChange={(values) => setRangeFilter(values, options)}
    />
  );
}

function ComfortabilityRange() {
  const { filter, setFilter } = useFilter();
  const options: SetRangeFilterOptions = {
    min: 1,
    max: 65,
    name: 'Comfortability',
    filterSetter: setFilter,
  };
  return (
    <RangeBase
      label={'Comfort'}
      min={options.min}
      max={options.max}
      values={getFilterRange(filter, options)}
      onChange={(values) => setRangeFilter(values, options)}
    />
  );
}

function ResilienceRange() {
  const { filter, setFilter } = useFilter();
  const options: SetRangeFilterOptions = {
    min: 1,
    max: 45,
    name: 'Resilience',
    filterSetter: setFilter,
  };
  return (
    <RangeBase
      label={options.name}
      min={options.min}
      max={options.max}
      values={getFilterRange(filter, options)}
      onChange={(values) => setRangeFilter(values, options)}
    />
  );
}

function DurabilityRange() {
  const { filter, setFilter } = useFilter();
  const options: SetRangeFilterOptions = {
    min: 0,
    max: 100,
    name: 'Durability',
    filterSetter: setFilter,
  };
  return (
    <RangeBase
      label={options.name}
      min={options.min}
      max={options.max}
      values={getFilterRange(filter, options)}
      onChange={(values) => setRangeFilter(values, options)}
    />
  );
}

type RangeBaseProps = {
  label: string;
  min: number;
  max: number;
  values: number[];
  onChange: (values: number[]) => void;
  valueToString?: (value: number) => string;
};

function RangeBase({
  label,
  values,
  min,
  max,
  onChange,
  valueToString,
}: RangeBaseProps) {
  if (!valueToString) {
    valueToString = (value) => `${value}`;
  }

  return (
    <div className={tw`w-full pl-1 pr-4 flex flex-row gap-6 items-center`}>
      <div className={tw`flex-none h-16 flex flex-row items-center`}>
        <div className={tw`w-20 font-bold text-primary-600`}>{label}</div>
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
                <div className={tw`flex flex-row justify-center items-center`}>
                  <div>
                    <div
                      className={tw`
                        relative -top-5 min-w-[28px] px-1 h-4 rounded-sm
                        bg-accent-500 text-white text-xs font-bold text-center
                      `}
                    >
                      {valueToString?.(values[props.key] ?? 0)}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
