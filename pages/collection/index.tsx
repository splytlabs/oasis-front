import type { NextPage } from 'next';
import HeadTag from '../../components/head-tag';
import MainContainer from '../../components/layout/main-container';
import { tw } from 'twind';
import Image from 'next/image';
import { css } from 'twind/css';

type CollectionData = {
  title: string;
  backgroundImg: string;
  logo: string;
  active: boolean;
};

const COLLECTION_DATA: CollectionData[] = [
  {
    title: 'Derby Stars',
    backgroundImg: '/derby-bg.png',
    logo: '/derby-logo.png',
    active: true,
  },
  {
    title: 'StepN',
    backgroundImg: '/stepn-bg.png',
    logo: '/stepn-logo.png',
    active: true,
  },
  {
    title: 'Coming Soon',
    backgroundImg: '',
    logo: '/splyt-logo.svg',
    active: false,
  },
  {
    title: 'Coming Soon',
    backgroundImg: '',
    logo: '/splyt-logo.svg',
    active: false,
  },
];

const Collection: NextPage = () => {
  return (
    <>
      <HeadTag
        title={'The Oasis'}
        url={'splyt.fi'}
        description={'Nft Rental Marketplace'}
        imageUrl={'/splyt-logo'}
      />
      <MainContainer>
        <div
          className={tw`
            w-[100%]
            px-[10%] mt-[122px]
            grid grid grid-cols-auto-280 gap-10
          `}
        >
          {COLLECTION_DATA.map((data, index) => {
            return <CollectionItem key={index} {...data} />;
          })}
        </div>
      </MainContainer>
    </>
  );
};

export default Collection;

const CollectionItem = ({
  title,
  backgroundImg,
  logo,
  active = true,
}: CollectionData) => {
  const style = css`
    position: relative;
    height: 340px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:before {
      content: '';
      background-image: url('${backgroundImg}');
      background-size: cover;
      opacity: 0.8;

      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      border-radius: 12px;
    }

    p {
      position: relative;

      font-style: normal;
      font-weight: 700;
      font-size: 28px;
      line-height: 38px;

      color: #ffffff;
    }
  `;

  const inActiveStyle = css`
    &:before {
      content: '';
      background-color: black;
      background-size: cover;
      opacity: 0.8;

      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      border-radius: 12px;
    }
  `;

  return (
    <div className={`${tw(style)} ${active ? tw(inActiveStyle) : ''}`}>
      <Image
        src={logo}
        alt={'collection-logo'}
        width={120}
        height={120}
        style={{ borderRadius: '120px' }}
      />
      <p>{title}</p>
    </div>
  );
};
