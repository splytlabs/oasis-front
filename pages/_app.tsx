import type { AppProps } from 'next/app';
import withTwindApp from '@twind/next/app';
import twindConfig from '../twind.config';
import { FilterProvider } from '../hooks/useFilter';
import { ModalProvider } from '../hooks/useModal';
import '../styles/global.css';
import { QueryProvider } from '../hooks/useQuery';
import { MetaMaskProvider } from 'metamask-react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetaMaskProvider>
      <FilterProvider>
        <QueryProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </QueryProvider>
      </FilterProvider>
    </MetaMaskProvider>
  );
}

export default withTwindApp(twindConfig, MyApp);
