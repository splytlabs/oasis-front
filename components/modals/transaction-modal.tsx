import React from 'react';
import ModalContainer from './modal-container';
import { useEffect, useRef } from 'react';
import { tw } from 'twind';

interface TransactionModalProps {
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = () => {
  const modal = useRef<HTMLDivElement>(null);

  const setAnimation = (element: HTMLDivElement) => {
    element.style.transition = `top 500ms cubic-bezier(0.25, 1, 0.5, 1)`;
    setTimeout(() => (element.style.top = '50%'));
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
    <ModalContainer
      onDimClick={() => {
        return;
      }}
    >
      <div
        ref={modal}
        className={tw`
        w-[375px] h-[220px] rounded-xl
        absolute top-[100%] left-[50%] -translate-x-1/2 -translate-y-1/2
        flex flex-col items-center justify-center
        bg-primary-50
      `}
      >
        <span className="loader"></span>
        <p className={tw`mt-[16px]`}>Sending Transaction...</p>
      </div>
    </ModalContainer>
  );
};

export default TransactionModal;
