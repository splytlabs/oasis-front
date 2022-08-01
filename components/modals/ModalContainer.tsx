import React, { MouseEvent, ReactElement, useRef } from 'react';
import { tw } from 'twind';

interface ModalWrapperProps {
  children: ReactElement[] | ReactElement;
  onDimClick: () => void;
}

const ModalContainer: React.FC<ModalWrapperProps> = ({
  children,
  onDimClick,
}) => {
  const dim = useRef<HTMLDivElement>(null);

  const handleDimClick = (e: MouseEvent) => {
    if (e.target === dim.current) {
      onDimClick();
    }
  };

  return (
    <div
      className={tw`
      w-screen h-screen
      absolute top-0 left-0
      z-20
    `}
    >
      <div
        ref={dim}
        className={tw`
        w-[100%] h-[100%]
        bg-black-dim
        relative
        `}
        onClick={handleDimClick}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
