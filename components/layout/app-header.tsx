import { tw } from 'twind';
import Img from 'components/img';
import WalletConnectButton from '../wallet-connect-button';
import Link from 'next/link';

export type AppHeaderProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function AppHeader(props: AppHeaderProps) {
  return (
    <header
      className={tw`
        ${props.className}
        w-screen bg-primary-50 z-10
        flex flex-row items-center px-12
        sticky top-0 shadow-lg
      `}
    >
      <Link href={'/collection'} passHref>
        <a className={tw`flex items-center`}>
          <Img src="/splyt-logo.svg" />
          <span className={tw`text-3xl font-bold text-accent ml-[8px]`}>
            SPLYT
          </span>
        </a>
      </Link>
      <div className={tw`flex-1 h-16`}></div>
      <div className={tw`font-bold text-accent px-4`}>Rent</div>
      <div className={tw`border-l-1 w-auto h-4 border-primary-300`}></div>
      <div className={tw`font-bold text-primary-500 px-4`}>Lend</div>
      <WalletConnectButton />
    </header>
  );
}
