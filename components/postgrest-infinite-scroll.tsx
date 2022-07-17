import { tw } from 'twind';
import { useEffect, useState } from 'react';
import runPostgrestQuery from 'lib/run-postgrest-query';
import InfiniteScroll from 'react-infinite-scroll-component';

export type PostgrestInfiniteScrollProps = {
  url?: string;
  apiKey?: string;
  query: string;
  limit: number;
  onRenderItem: (item: unknown, index: number) => React.ReactNode;
  className?: string;
  loader?: JSX.Element;
  children?: React.ReactNode;
};

export default function PostgrestInfiniteScroll(
  props: PostgrestInfiniteScrollProps
) {
  // query에서 &limit={num} 제거하는 로직 필요
  // select문에 pk가 꼭 포함되어야 함 검사 방법 필요
  const [state, setState] = useState({
    items: [] as unknown[],
  });

  const fetchData = () => {
    const lastItem = state.items[state.items.length - 1] as { id: string };
    const lastItemId = lastItem?.id ?? '0';
    const query = `${props.query}&limit=${props.limit}&id=gt.${lastItemId}`;
    void (async function () {
      const newItems = await runPostgrestQuery(query, {
        endpointURL: props.url,
        apiKey: props.apiKey,
      });
      setState({ items: state.items.concat(newItems) });
    })();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchData(), []);

  return (
    <InfiniteScroll
      className={tw`${props.className}`}
      dataLength={state.items.length}
      next={fetchData}
      hasMore={true}
      loader={props.loader || <div>Loading...</div>}
    >
      {state.items.map((item, index) => props.onRenderItem(item, index))}
      {props.children}
    </InfiniteScroll>
  );
}
