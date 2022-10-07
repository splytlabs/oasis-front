import { tw } from 'twind';
import { AiOutlineUser } from 'react-icons/ai';
import { useModals } from '../hooks/useModal';
import LoginModal from './modals/login-modal';
import { useMetaMask } from 'metamask-react';
import Image from 'next/image';
import React from 'react';
import PortfolioModal from './modals/portfolio-modal';

export type WalletConnectButtonProps = {
  children?: React.ReactNode;
};

export default function WalletConnectButton({
  children,
}: WalletConnectButtonProps) {
  const { status, account } = useMetaMask();
  const { openModal } = useModals();

  return (
    <button
      className={tw`
        w-auto h-10 rounded-full px-3 ml-3
        bg-accent focus:outline-none
      `}
      onClick={() => {
        if (status === 'connected') {
          openModal(PortfolioModal, {});
        } else {
          openModal(LoginModal, {});
        }
      }}
    >
      {children ?? (
        <div
          className={tw`
            font-bold text-white px-2 flex flex-row items-center gap-1
          `}
        >
          {status === 'notConnected' ? (
            <span
              className={tw`
                flex items-center
                mr-[6px]
            `}
            >
              <Image
                src={'/wallet-icon-white.svg'}
                alt={'wallet'}
                width={30}
                height={30}
              />
            </span>
          ) : (
            <AiOutlineUser className={tw`text-2xl`} />
          )}
          {status && account
            ? `${account.slice(0, 3)}...${account.slice(-3)}`
            : 'Wallet'}
        </div>
      )}
    </button>
  );
}
