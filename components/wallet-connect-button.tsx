import { tw } from 'twind';
import { AiOutlineUser } from 'react-icons/ai';
import { useModals } from '../hooks/useModal';
import LoginModal from './modals/LoginModal';

export type WalletConnectButtonProps = {
  children?: React.ReactNode;
};

export default function WalletConnectButton({
  children,
}: WalletConnectButtonProps) {
  const { openModal } = useModals();

  return (
    <button
      className={tw`
        w-auto h-10 rounded-full px-3 ml-3
        bg-accent focus:outline-none
      `}
      onClick={() => {
        openModal(LoginModal, {});
      }}
    >
      {children ?? (
        <div
          className={tw`
            font-bold text-white px-2 flex flex-row items-center gap-1
          `}
        >
          <AiOutlineUser className={tw`text-2xl`} /> Wallet
        </div>
      )}
    </button>
  );
}
