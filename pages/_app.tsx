import type { AppProps } from 'next/app';
import withTwindApp from '@twind/next/app';
import twindConfig from '../twind.config';
import { FilterProvider } from '../hooks/useFilter';
import { ModalProvider } from '../hooks/useModal';
import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FilterProvider>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </FilterProvider>
  );
}

export default withTwindApp(twindConfig, MyApp);
