import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { tw } from 'twind';
import AppHeader from 'components/app-header';
import runPostgrestQuery from 'lib/run-postgrest-query';
import Img from 'components/img';
import React, { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { GrStatusInfo } from 'react-icons/gr';
import { BsNut, BsClock } from 'react-icons/bs';
import { BiDetail } from 'react-icons/bi';

type PageProps = {
  rentalInfo: { [key: string]: string };
};

const Page: NextPage<PageProps> = ({ rentalInfo }) => {
  const isValid = rentalInfo.contract_address && rentalInfo.token_id;

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
          flex flex-col items-center
        `}
      >
        <AppHeader></AppHeader>
        <div
          className={tw`
            flex flex-row justify-center p-12 gap-8 flex-wrap
          `}
        >
          <LeftSide rentalInfo={rentalInfo} />
          <RightSide rentalInfo={rentalInfo} />
        </div>
        {/* <div
          className={tw`
            font-bold text-sm text-primary-800 mt-12 mb-4
          `}
        >
          <pre>
            {JSON.stringify(isValid ? rentalInfo : 'Not Found', null, 2)}
          </pre>
        </div> */}
      </main>
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageProps>> {
  const key = (context.query['nft-unique-key'] ?? '') as string;
  const [contractAddress, tokenId] = key.split('@');
  const query = [
    `rest/v1/rental_infos_view?select=*`,
    `contract_address=eq.${contractAddress ?? ''}`,
    `token_id=eq.${tokenId ?? ''}`,
  ].join('&');
  // console.log('query', query);
  const { items } = await runPostgrestQuery(query);
  return {
    props: { rentalInfo: (items[0] as { [key: string]: string }) ?? {} },
  };
}

export default Page;

function LeftSide({ rentalInfo }: PageProps) {
  const dummyText = `
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Aenean commodo ligula eget dolor. Aenean massa.
    Cum sociis natoque penatibus et magnis dis parturient montes,
    nascetur ridiculus mus.
  `;

  return (
    <div className={tw`w-[360px] flex flex-col gap-4`}>
      <div className={tw`flex flex-row items-center`}>
        <div className={tw`flex flex-col`}>
          <div className={tw`font-bold text-xs text-primary-900`}>
            Derby Stars
          </div>
          <div className={tw`font-bold`}>{rentalInfo.name}</div>
        </div>
        <div className={tw`flex-1 self-stretch`} />
        <div
          className={tw`
            flex flex-row justify-center items-center
            bg-primary-50 rounded-full p-2 mr-1
          `}
        >
          <AiOutlineUser />
        </div>
        <div className={tw`flex flex-col`}>
          <div className={tw`font-bold text-xs text-primary-700`}>Owner</div>
          <div className={tw`text-xs text-primary-700`}>1ca9...zjrc</div>
        </div>
      </div>
      <div className={tw`w-full pt-[100%] bg-white rounded-lg overflow-hidden`}>
        <Img className={tw`w-full -mt-[100%]`} src={rentalInfo.image ?? ''} />
      </div>
      <div className={tw`w-full`}>
        <Collapsible
          // prettier-ignore
          header={<><GrStatusInfo /> About </>}
        >
          {dummyText}
        </Collapsible>
        <Collapsible
          // prettier-ignore
          header={<><BsNut /> Properties </>}
        >
          {dummyText}
        </Collapsible>
        <Collapsible
          // prettier-ignore
          header={<><BsClock /> Dates </>}
        >
          {dummyText}
        </Collapsible>
        <Collapsible
          // prettier-ignore
          header={<><BiDetail /> Details </>}
        >
          {dummyText}
        </Collapsible>
      </div>
    </div>
  );
}

function RightSide({ rentalInfo }: PageProps) {
  return (
    <div className={tw`w-[360px] flex flex-col gap-4`}>
      <RentalRequestForm rentalInfo={rentalInfo} />
      <TabGroup
        startTabName="Stats"
        tabs={[
          {
            name: 'Stats',
            content: <DerbyStarsStatsTab rentalInfo={rentalInfo} />,
          },
          {
            name: 'Appearance',
            content: <DerbyStarsAppearanceTab rentalInfo={rentalInfo} />,
          },
        ]}
      />
    </div>
  );
}

type CollapsibleProps = {
  header: React.ReactNode;
  children: React.ReactNode;
};

function Collapsible({ header, children }: CollapsibleProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className={tw`
        flex flex-col border-solid border-1 border-b-0
        first:rounded-t-lg last:rounded-b-lg last:border-b-1
      `}
    >
      <div
        className={tw`
          flex flex-row items-center p-4 hover:cursor-pointer
          font-bold text-sm gap-1
        `}
        onClick={() => setCollapsed(!collapsed)}
      >
        {header}
        <div className={tw`flex-1`}></div>
        {collapsed ? <MdExpandMore /> : <MdExpandLess />}
      </div>
      {!collapsed && (
        <div
          className={tw`
            border-solid border-t-1 bg-primary-50 p-4
            text-xs
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function RentalRequestForm({ rentalInfo }: PageProps) {
  const daysMin = Number(rentalInfo.days_min) || 1;
  const daysMax = Number(rentalInfo.days_max) || 1;
  const [period, setPeriod] = useState(daysMin);
  const price = Number(rentalInfo.price) / 10_000_000;
  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value.replaceAll(/[^0-9]/g, ''));
    setPeriod(value);
  };
  const clampPeriod = () => {
    setPeriod(Math.min(Math.max(period, daysMin), daysMax));
  };

  return (
    <div
      className={tw`
        w-full bg-primary-50 rounded-lg
        flex flex-col p-4 gap-2
      `}
    >
      <div className={tw`font-bold text-sm text-primary-700`}>
        Rental Period
      </div>
      <div
        className={tw`
          flex flex-row items-center bg-white rounded-lg
        `}
      >
        <input
          className={tw`
            flex-1 focus:outline-none px-2
          `}
          min={rentalInfo.days_min}
          max={rentalInfo.days_max}
          step="1"
          value={period}
          onChange={handlePeriodChange}
          onBlur={clampPeriod}
        />
        <button
          className={tw`
            bg-primary-700 rounded-lg w-16 py-1 m-2 h-8
            text-white text-xs focus:outline-none
          `}
          onClick={() => setPeriod(daysMax)}
        >
          Max
        </button>
      </div>
      <div className={tw`text-xs text-primary-500`}>
        Min {daysMin} Day / Max {daysMax} Day
      </div>
      <div className={tw`flex flex-row items-center mt-6`}>
        <div className={tw`font-bold text-sm text-primary-700 mr-4`}>
          Rental Price
        </div>
        <Image
          src="/polygon-icon.png"
          alt="polygon-icon"
          width={14}
          height={14}
        ></Image>
        <div className={tw`text-xs text-primary-500 ml-1`}>
          {price.toFixed(2)}/Day
        </div>
      </div>
      <div className={tw`flex flex-row items-center mb-4`}>
        <Image
          src="/polygon-icon.png"
          alt="polygon-icon"
          width={32}
          height={32}
        ></Image>
        <div className={tw`font-bold text-3xl text-primary-900 ml-2`}>
          {(price * period).toFixed(2)}
        </div>
      </div>
      <button
        className={tw`
          bg-accent rounded-lg h-12
          font-bold text-white text-lg focus:outline-none
        `}
        onMouseOver={clampPeriod}
      >
        Rent
      </button>
    </div>
  );
}

type TabGroupProps = {
  startTabName?: string;
  tabs: { name: string; content: React.ReactNode }[];
};

function TabGroup({ startTabName, tabs }: TabGroupProps) {
  const [tabName, setTabName] = useState(startTabName ?? tabs[0]?.name ?? '');

  return (
    <div className={tw`flex flex-col gap-4`}>
      <div className={tw`flex flex-row`}>
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={tw`
              flex flex-row justify-center items-center px-4 py-2
              flex-1 font-bold text-lg truncate
              border-solid border-b-2 hover:cursor-pointer
              ${
                tab.name === tabName
                  ? 'border-primary-700 text-primary-700'
                  : 'border-primary-200 text-primary-200'
              }
            `}
            onClick={() => setTabName(tab.name)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      {tabs.map((tab) =>
        tab.name !== tabName ? null : (
          <div
            key={tab.name}
            className={tw`w-full min-h-full rounded-lg overflow-hidden`}
          >
            {tab.content}
          </div>
        )
      )}
    </div>
  );
}

function DerbyStarsStatsTab({ rentalInfo }: PageProps) {
  const statusNames = ['Speed', 'Power', 'Stamina', 'Grit', 'Intellect'];
  const talentNames = [
    'Runaway Runner',
    'Front Runner',
    'Stalker',
    'Stretch Runner',
  ];
  return (
    <div
      className={tw`
        w-full bg-primary-50 rounded-lg flex flex-col p-4 gap-6
      `}
    >
      {statusNames.map((x) => {
        const p = Number(rentalInfo[x]) || 0;
        return (
          <div key={x} className={tw`flex flex-col gap-2`}>
            <div className={tw`font-bold text(primary-700 sm)`}>{x}</div>
            <div
              className={tw`relative overflow-hidden rounded-full w-full h-2`}
            >
              <div className={tw`w-full h-full bg-white`}></div>
              <div
                className={tw`
                  w-[${p}%] h-full bg-accent absolute top-0 rounded-full
                `}
              ></div>
            </div>
            <div className={tw`flex flex-row items-end`}>
              <div className={tw`font-bold text(primary-700 xs)`}>{p}</div>
              <div className={tw`text(primary-500 [10px])`}>/100</div>
            </div>
          </div>
        );
      })}
      <div
        className={tw`
          flex flex-col gap-2
          font-bold text(primary-700 sm)
        `}
      >
        Talent
        {talentNames.map((name) => {
          const key = `Talent:${name.replaceAll(' ', '')}`;
          const grade = ['D', 'C', 'B', 'A', 'S'][Number(rentalInfo[key]) || 0];
          return (
            <div
              key={name}
              className={tw`
              flex flex-row items-center bg-white rounded-lg p-2 gap-2
              text(primary-700 xs) self-start
            `}
            >
              <div>{name}</div>
              <div className={tw`border-solid border-l-1 h-4`}></div>
              <div className={tw`font-bold text-accent`}>{grade}</div>
            </div>
          );
        })}
      </div>
      <div
        className={tw`
          flex flex-col gap-2
          font-bold text(primary-700 sm)
        `}
      >
        Skills
        {[...Array(6).keys()].map((x) => {
          const key = `Skill ${x + 1}`;
          return (
            <div
              key={key}
              className={tw`
              flex flex-row items-center bg-white rounded-lg p-2 gap-2
              text(primary-700 xs) self-start
            `}
            >
              <div>{rentalInfo[key]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DerbyStarsAppearanceTab({ rentalInfo }: PageProps) {
  const partNames = [
    'Horn',
    'Wings',
    'Mane',
    'Eyes',
    'Muzzle',
    'Rein',
    'Torso',
    'Legs',
    'Tail',
  ];
  return (
    <div
      className={tw`
        w-full bg-primary-50 rounded-lg flex flex-col p-4 gap-6
      `}
    >
      {partNames.map((name) => {
        return (
          rentalInfo[name] && (
            <div
              key={name}
              className={tw`
                flex flex-row items-center p-2 gap-1
              `}
            >
              <div className={tw`font-bold text(primary-900 lg)`}>{name}</div>
              <div className={tw`flex-1`}></div>
              <div className={tw`font-bold text(primary-700 sm)`}>
                {rentalInfo[name]}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}
