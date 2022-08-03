import type { AppProps } from 'next/app';
import withTwindApp from '@twind/next/app';
import twindConfig from '../twind.config';
import { FilterProvider } from '../hooks/useFilter';
import { ModalProvider } from '../hooks/useModal';
import '../styles/global.css';
import { QueryProvider } from '../hooks/useQuery';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FilterProvider>
      <QueryProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </QueryProvider>
    </FilterProvider>
  );
}

export default withTwindApp(twindConfig, MyApp);
