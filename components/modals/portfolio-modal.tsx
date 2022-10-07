import React from 'react';
import ModalContainer from './modal-container';
import { useEffect, useRef } from 'react';
import { tw } from 'twind';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface PortfolioModalProps {
  onClose: () => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ onClose }) => {
  const modal = useRef<HTMLDivElement>(null);

  const setAnimation = (element: HTMLDivElement) => {
    element.style.transition = `right 500ms cubic-bezier(0.25, 1, 0.5, 1)`;
    setTimeout(() => (element.style.right = '0'));
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
        w-[375px] h-[100vh]
        absolute top-[0] -right-[100%] px-[20px] py-[25px]
        flex flex-row items-stretch
        bg-primary-50
      `}
      >
        <div
          className={tw`
            w-[100%]
          `}
        >
          <h3
            className={tw`
              flex items-center
              text-[16px] text-[#1C2541]
              font-medium
            `}
          >
            <span
              className={tw`
                flex items-center
                mr-[6px]
            `}
            >
              <Image
                src={'/wallet-icon.svg'}
                alt={'wallet'}
                width={30}
                height={30}
              />
            </span>
            Wallet
          </h3>
          <li
            className={tw`
            mt-[10px]
            flex flex-col
          `}
          >
            <ModalItem name={'Portfolio'} closeModal={onClose} />
          </li>
        </div>
      </div>
    </ModalContainer>
  );
};

type ModalItemProps = {
  name: string;
  closeModal: () => void;
};

const ModalItem = ({ name, closeModal }: ModalItemProps) => {
  const router = useRouter();

  const connectWallet = () => {
    closeModal();
    void router.push('/mypage');
  };

  return (
    <ul
      className={tw`
        w-[100%] h-[64px]
        flex items-center
        p-[12px]
        border
        mt-[-1px]
        cursor-pointer
      `}
      onClick={() => void connectWallet()}
    >
      <p
        className={tw`
          text-[16px] text-[#1C2541] font-semibold
        `}
      >
        {name}
      </p>
    </ul>
  );
};

export default PortfolioModal;
