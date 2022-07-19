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
  const [items, setItems] = useState<object[]>([]);

  const fetchData = async () => {
    const lastItem = items[items.length - 1] as { id: string };
    const lastItemId = lastItem?.id ?? '0';
    const query = `${props.query}&limit=${props.limit}&id=gt.${lastItemId}`;
    // console.log('fetchData():', query);
    const newItems = await runPostgrestQuery(query, {
      endpointURL: props.url,
      apiKey: props.apiKey,
    });
    setItems(items.concat(newItems));
  };

  useEffect(() => {
    setItems([]);
  }, [props.query]);

  useEffect(() => {
    if (items.length === 0) {
      void fetchData();
    }
  });

  return (
    <InfiniteScroll
      className={tw`${props.className}`}
      dataLength={items.length}
      next={() => void fetchData()}
      hasMore={true}
      loader={props.loader || <div>Loading...</div>}
    >
      {items.map((item, index) => props.onRenderItem(item, index))}
      {props.children}
    </InfiniteScroll>
  );
}
