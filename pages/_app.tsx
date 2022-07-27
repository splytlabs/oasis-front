import type { AppProps } from 'next/app';
import withTwindApp from '@twind/next/app';
import twindConfig from '../twind.config';
import { FilterProvider } from '../hooks/useFilter';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FilterProvider>
      <Component {...pageProps} />
    </FilterProvider>
  );
}

export default withTwindApp(twindConfig, MyApp);
