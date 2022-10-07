import type { NextPage } from 'next';
import HeadTag from '../../components/head-tag';
import MainContainer from '../../components/layout/main-container';
import { tw } from 'twind';
import { useEffect, useState } from 'react';
import Img from 'components/img';
import { LocalStroage, RentalItem } from '../../lib/localStroage';

const MyPage: NextPage = () => {
  const [rentedItems, setRentedItem] = useState<RentalItem[]>([]);

  // const fetch = async () => {
  //   try {
  //     if (account) {
  //       const result = await runPostgrestQuery(
  //         `rest/v1/rents?select=*&renter=ilike.${account}`
  //       );
  //       console.log(result);
  //     }
  //   } catch (e) {
  //     console.error('fetch error', e);
  //   }
  // };

  useEffect(() => {
    setRentedItem(LocalStroage.rentedItems);
    // void fetch();
  }, []);

  return (
    <>
      <HeadTag
        title={'The SPLYT Marketplace'}
        url={'splyt.fi'}
        description={'Nft Rental Marketplace'}
        imageUrl={'/splyt-logo'}
      />
      <MainContainer>
        <div
          className={tw`
            w-[100%]
            px-[10%] mt-[66px] mb-[40px]
            flex flex-wrap
            justify-start
          `}
        >
          <h1
            className={tw`
                font-bold text-4xl text-primary-700`}
          >
            Portfolio
          </h1>
        </div>
        <div
          className={tw`
            w-[100%]
            px-[10%]
            flex flex-wrap
            justify-start
            gap-10
          `}
        >
          {rentedItems.map((e, i) => {
            return (
              <div
                key={i}
                className={tw`
                    w-[330px]
                `}
              >
                <RentalItem
                  name={e.name ?? ''}
                  collectionName={e.collectionName ?? ''}
                  image={e.image ?? ''}
                  endAt={e.endAt}
                  price={Number(e.price)}
                />
              </div>
            );
          })}
        </div>
      </MainContainer>
    </>
  );
};

function RentalItem({ name, image, price, collectionName, endAt }: RentalItem) {
  const calcualteLeftDays = (endAt: number): [number, string] => {
    const DAY_TO_SECONDS = 24 * 60 * 60;
    const HOURS_TO_SECONDS = 60 * 60;
    const MINUTES_TO_SECONDS = 60;

    const leftSeconds = endAt - Date.now() / 1000;

    const toDays = Math.floor(leftSeconds / DAY_TO_SECONDS);
    const toHours = Math.floor(leftSeconds / HOURS_TO_SECONDS);
    const toMinutes = Math.floor(leftSeconds / MINUTES_TO_SECONDS);

    if (toDays > 0) return [toDays, 'Days'];
    if (toHours > 0) return [toHours, 'Hours'];
    if (toMinutes > 0) return [toMinutes, 'Minutes'];
    return [leftSeconds, 'Seconds'];
  };

  const [leftTime, unit] = calcualteLeftDays(endAt);

  return (
    <div
      className={tw`
        h-auto border-solid
        bg-primary-50 rounded-lg
        flex flex-col px-[20px] py-[24px]
      `}
    >
      <div
        className={tw`
        flex flex-row justify-between mb-[16px]
      `}
      >
        <div className={tw`flex flex-col`}>
          <h1 className={tw`font-bold text-gray-600 mb-[2px]`}>{name}</h1>
          <p className={tw`text-xs`}>{collectionName}</p>
        </div>
        <div
          className={tw`flex justify-center items-center bg-[#EBEFFF] px-[8px] py-[4px] rounded-[16px]`}
        >
          <span className={tw`text-accent font-bold`}>Rented</span>
        </div>
      </div>

      <div className={tw`w-full pt-[100%] rounded-xl bg-white mb-[24px]`}>
        <Img className={tw`w-full -mt-[100%] rounded-xl`} src={image} />
      </div>
      <div className={tw`w-full flex flex-row items-center px-1 py-1 mb-[4px]`}>
        <div className={tw`text-m text-primary-700`}>Expires After</div>
        <div className={tw`flex-1`}></div>
        <div className={tw`text-m pr-[1px]`}>
          <span
            className={tw`font-bold text-primary-900`}
          >{`${leftTime}`}</span>
          <span className={tw`text-xs`}>{` ${unit}`}</span>
        </div>
      </div>
      <div className={tw`w-full flex flex-row items-center px-1 pb-2`}>
        <div className={tw`text-m text-primary-700`}>Price</div>
        <div className={tw`flex-1`}></div>
        <div className={tw`text-m pr-[1px]`}>
          <span className={tw`font-bold text-primary-900`}>{`${price}`}</span>
          <span className={tw`text-xs`}>/Day</span>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
