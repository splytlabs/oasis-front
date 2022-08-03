import React from 'react';
import ModalContainer from './modal-container';
import { useEffect, useRef } from 'react';
import { tw } from 'twind';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
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
        absolute top-[0] -right-[100%]
        flex flex-row items-stretch
        bg-primary-50
      `}
      ></div>
    </ModalContainer>
  );
};

export default LoginModal;
