import { tw } from 'twind';
import { useEffect, useState } from 'react';
import runPostgrestQuery from 'lib/run-postgrest-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';

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
  const [fetchQuery] = useState({ current: '', previous: '' });
  const [items, setItems] = useState<object[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    const queryParts = [
      props.query,
      `order=id.desc.nullslast`,
      `limit=${props.limit}`,
      `offset=${items.length}`,
    ];
    const query = queryParts.filter((x) => x).join('&');
    if (fetchQuery.current === query) {
      return;
    }
    fetchQuery.previous = fetchQuery.current;
    fetchQuery.current = query;
    try {
      const { items: newItems } = await runPostgrestQuery(query, {
        endpointURL: props.url,
        apiKey: props.apiKey,
        count: 'exact',
      });
      if (newItems.length > 0) {
        setItems(items.concat(newItems));
      } else if (items.length == 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      fetchQuery.current = fetchQuery.previous;
    }
  };

  useEffect(() => {
    setItems([]);
    setHasMore(true);
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
      hasMore={hasMore}
      loader={props.loader}
      scrollableTarget={"main"}
    >
      {!hasMore && (
        <div className={tw`absolute mt-24`}>
          <Image
            className={tw`rounded-xl`}
            src="/no-search-result.webp"
            alt="no-search-result"
            width={360}
            height={360}
          />
        </div>
      )}
      {items.map((item, index) => props.onRenderItem(item, index))}
      {props.children}
    </InfiniteScroll>
  );
}
