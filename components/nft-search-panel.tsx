import { tw } from 'twind';
import { useState } from 'React';
import IconButton from 'components/icon-button';
import { CgClose } from 'react-icons/cg';
import { Range } from 'react-range';

export type NFTSearchPanelProps = {
  onApply?: (query: string) => void;
  onReset?: () => void;
  onClose?: () => void;
};

type TabName = 'Basic' | 'Appearance' | 'Properties';

type TabProps = {
  filterMap?: Map<string, string>;
};

export default function NFTSearchPanel(props: NFTSearchPanelProps) {
  const tabNames = ['Basic', 'Appearance', 'Properties'] as TabName[];
  const [tabName, setTabName] = useState<TabName>('Properties');
  const [filterMap] = useState(new Map<string, string>());

  const buildQuery = () => {
    const head = '/rest/v1/nft_infos?select=id,name,image';
    const body = Array.from(filterMap.values()).join('&');
    return `${head}&${body}`;
  };

  return (
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
          {tabName === 'Properties' && <PropertiesTab filterMap={filterMap} />}
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
            onClick={() => props.onReset?.()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function BasicTab(_props: TabProps) {
  return <div className={tw`w-full h-full bg-red-100`}></div>;
}

function AppearanceTab(_props: TabProps) {
  return <div className={tw`w-full h-full bg-green-100`}></div>;
}

function PropertiesTab({ filterMap }: TabProps) {
  const [speedRange, setSpeedRange] = useState([0, 100]);

  const handleSpeedRangeChange = (range: number[]) => {
    // console.log('Speed Range:', range);
    setSpeedRange([...range]);
    const a = range[0] ?? 0;
    const b = range[1] ?? 100;
    filterMap?.set('Speed', `Speed=gte.${a}&Speed=lte.${b}`);
  };

  return (
    <div className={tw`w-full h-full bg-blue-100`}>
      <div className={tw`flex flex-row items-center gap-4 p-8`}>
        <div className={tw`font-bold text-primary-700`}>Speed</div>
        <Range
          min={0}
          max={100}
          values={speedRange}
          onChange={handleSpeedRangeChange}
          renderTrack={({ props, children }) => {
            return (
              <div
                {...props}
                style={{ ...props.style }}
                className={tw`w-64 h-1 bg-primary-300`}
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
                className={tw`w-4 h-4 bg-accent rounded-full`}
              />
            );
          }}
        />
      </div>
    </div>
  );
}
