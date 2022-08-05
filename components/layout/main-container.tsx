import type { ReactElement } from 'react';
import AppHeader from './app-header';
import { Modals } from '../../hooks/useModal';
import { tw } from 'twind';

type MainContainerProps = {
  children: ReactElement | ReactElement[];
};

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <main
      className={tw`
        w-[100%] h-[100%]
        absolute top-0 left-0
        overflow-scroll
        flex flex-col items-center`}
    >
      <AppHeader></AppHeader>
      {children}
      <Modals></Modals>
    </main>
  );
};

export default MainContainer;
