import { tw } from 'twind';
import { createContext, useContext, useState } from 'react';
import IconButton from 'components/icon-button';
import { CgClose } from 'react-icons/cg';
import { Range, getTrackBackground } from 'react-range';

export const NFTSearchPanelContext = createContext({
  filterMap: new Map<string, string>(),
  setFilter: (() => {
    return;
  }) as (name: string, filter: string) => void,
});

export type NFTSearchPanelProps = {
  onApply?: (query: string) => void;
  onReset?: () => void;
  onClose?: () => void;
};

type TabName = 'Basic' | 'Appearance' | 'Properties';

export default function NFTSearchPanel(props: NFTSearchPanelProps) {
  const tabNames = ['Basic', 'Appearance', 'Properties'] as TabName[];
  const [tabName, setTabName] = useState<TabName>('Properties');
  const [filterState, setFilterState] = useState({
    filterMap: useContext(NFTSearchPanelContext).filterMap,
  });
  const { filterMap } = filterState;
  const setFilter = (name: string, filter: string) => {
    filterMap.set(name, filter);
    setFilterState({ filterMap });
  };

  const buildQuery = () => {
    const head = '/rest/v1/nft_infos?select=id,name,image';
    const body = Array.from(filterMap.values())
      .filter((x) => x)
      .join('&');
    return `${head}${!body ? '' : `&${body}`}`;
  };

  const handleReset = () => {
    for (const key of filterMap.keys()) {
      filterMap.set(key, '');
    }
    setFilterState({ filterMap });
    props.onReset?.();
  };

  return (
    <NFTSearchPanelContext.Provider value={{ filterMap, setFilter }}>
      <div
        className={tw`
        w-[1024px] h-[720px] rounded-xl
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
                {item}
              </div>
            );
          })}
        </div>
        <div className={tw`bg-white flex-1 flex flex-col items-stretch`}>
          <div className={tw`flex flex-row justify-end pt-4 pr-4`}>
            <IconButton
              className={tw`bg-opacity-0`}
              icon={<CgClose />}
              onClick={() => props.onClose?.()}
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
              bg-accent rounded-lg focus:outline-none
              text-white font-bold w-24 h-10
            `}
              onClick={() => props.onApply?.(buildQuery())}
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
    </NFTSearchPanelContext.Provider>
  );
}

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
  const { filterMap, setFilter } = useContext(NFTSearchPanelContext);

  const handleChange = (values: number[]) => {
    const a = Math.max(values[0] ?? min, min);
    const b = Math.min(values[1] ?? max, max);
    setFilter(name, `${name}=gte.${a}&${name}=lte.${b}`);
  };

  const range = () => {
    const values = filterMap
      .get(name)
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
  const { filterMap, setFilter } = useContext(NFTSearchPanelContext);

  const handleChange = (values: number[]) => {
    const a = Math.max(values[0] ?? min, min);
    const b = Math.min(values[1] ?? max, max);
    setFilter(colName, `"${colName}"=gte.${a}&"${colName}"=lte.${b}`);
  };

  const range = () => {
    const values = filterMap
      .get(colName)
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
