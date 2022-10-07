import type { NextPage } from 'next';
import HeadTag from '../../components/head-tag';
import MainContainer from '../../components/layout/main-container';
import { tw } from 'twind';
import Image from 'next/image';
import { css } from 'twind/css';
import Link from 'next/link';

interface CollectionData {
  slug: string;
  title: string;
  backgroundImg: string;
  logo: string;
  active: boolean;
}

const COLLECTION_DATA: CollectionData[] = [
  // {
  //   slug: 'derbystars',
  //   title: 'Derby Stars',
  //   backgroundImg: '/derby-bg.png',
  //   logo: '/derby-logo.png',
  //   active: true,
  // },
  {
    slug: 'snkrz',
    title: 'SNKRZ',
    backgroundImg: '/snkrz-bg.png',
    logo: '/snkrz-logo.png',
    active: true,
  },
  {
    slug: '',
    title: 'Coming Soon',
    backgroundImg: '',
    logo: '/splyt-logo.svg',
    active: false,
  },
  {
    slug: '',
    title: 'Coming Soon',
    backgroundImg: '',
    logo: '/splyt-logo.svg',
    active: false,
  },
  {
    slug: '',
    title: 'Coming Soon',
    backgroundImg: '',
    logo: '/splyt-logo.svg',
    active: false,
  },
  {
    slug: '',
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
        title={'The SPLYT Marketplace'}
        url={'splyt.fi'}
        description={'Nft Rental Marketplace'}
        imageUrl={'/splyt-logo'}
      />
      <MainContainer>
        <div
          className={tw`
            w-[100%]
            px-[10%] mt-[122px]
            grid grid-cols-auto-280 gap-10
            justify-center
          `}
        >
          {COLLECTION_DATA.map((data, index) => {
            if (!data.active) {
              return <InActiveCollectionItem key={index} {...data} />;
            }
            return <CollectionItem key={index} {...data} />;
          })}
        </div>
      </MainContainer>
    </>
  );
};

export default Collection;

const CollectionItem = ({
  slug,
  title,
  backgroundImg,
  logo,
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

  return (
    <Link href={`collection/${slug}`}>
      <a className={tw(style)}>
        <Image
          src={logo}
          alt={'collection-logo'}
          width={120}
          height={120}
          style={{ borderRadius: '120px' }}
        />
        <p>{title}</p>
      </a>
    </Link>
  );
};

const InActiveCollectionItem = ({ logo, title }: CollectionData) => {
  const style = css`
    position: relative;
    height: 340px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    cursor: default;

    &:before {
      content: '';
      background-color: black;
      background-size: cover;
      opacity: 0.7;

      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      border-radius: 12px;
    }

    div {
      width: 100%;
      height: 48px;
      border-radius: 0 0 12px 12px;

      display: flex;
      justify-content: center;
      align-items: center;

      background-color: #eaebee;

      position: absolute;
      bottom: 0;
    }

    p {
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 38px;

      color: #000000;
    }
  `;

  return (
    <div className={tw(style)}>
      <Image
        src={logo}
        alt={'collection-logo'}
        width={120}
        height={120}
        style={{ borderRadius: '120px' }}
      />
      <div>
        <p>{title}</p>
      </div>
    </div>
  );
};
