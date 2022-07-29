import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import Head from 'next/head';
import { tw } from 'twind';
import AppHeader from 'components/app-header';
import runPostgrestQuery from 'lib/run-postgrest-query';

type PageProps = {
  rentalInfo: { [key: string]: string };
};

const Page: NextPage<PageProps> = ({ rentalInfo }) => {
  const isValid = rentalInfo.contract_address && rentalInfo.token_id;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Game NFT Search Demo</title>
      </Head>
      <main
        id={'main'}
        className={tw`
          w-[100%] h-[100%]
          absolute top-0 left-0
          overflow-scroll
          flex flex-col items-center
        `}
      >
        <AppHeader></AppHeader>
        <div
          className={tw`
            font-bold text-lg text-primary-800 mt-12 mb-4
          `}
        >
          <pre>
            {JSON.stringify(isValid ? rentalInfo : 'Not Found', null, 2)}
          </pre>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageProps>> {
  const key = (context.query['nft-unique-key'] ?? '') as string;
  const [contractAddress, tokenId] = key.split('@');
  const query = [
    `rest/v1/rental_infos_view?select=*`,
    `contract_address=eq.${contractAddress ?? ''}`,
    `token_id=eq.${tokenId ?? ''}`,
  ].join('&');
  // console.log('query', query);
  const { items } = await runPostgrestQuery(query);
  return {
    props: { rentalInfo: (items[0] as { [key: string]: string }) ?? {} },
  };
}

export default Page;
