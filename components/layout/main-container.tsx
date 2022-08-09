import type { ReactElement } from 'react';
import AppHeader from './app-header';
import { Modals } from '../../hooks/useModal';
import { tw } from 'twind';

type MainContainerProps = {
  children: ReactElement | ReactElement[];
};

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <>
      <AppHeader></AppHeader>
      <main
        className={tw`
        w-[100%] h-[100%]
        absolute top-0 left-0
        box-border pt-16
        overflow-scroll
        flex flex-col items-center`}
      >
        {children}
      </main>
      <Modals></Modals>
    </>
  );
};

export default MainContainer;
