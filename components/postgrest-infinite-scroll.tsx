import { tw } from 'twind';
import { useState } from 'react';
import { InView } from 'react-intersection-observer';
import Img from 'components/img';
import { useQuery } from 'hooks/useQuery';
import type { FilterState } from 'hooks/useFilter';

export type PostgrestInfiniteScrollProps = {
  appliedFilter: FilterState;
  fetchLimit: number;
  onRenderItem: (item: unknown, index: number) => React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export default function PostgrestInfiniteScroll(
  props: PostgrestInfiniteScrollProps
) {
  const filter = props.appliedFilter;
  const { data, fetch, getQueryString } = useQuery();
  const [fetchQuery] = useState({ current: '', previous: '' });
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = async () => {
    const offset = data.items.length;
    const limit = props.fetchLimit;
    const query = getQueryString(filter, offset, limit, data.order);
    if (fetchQuery.current === query) {
      return;
    }
    fetchQuery.previous = fetchQuery.current;
    fetchQuery.current = query;
    try {
      const newItems = await fetch(filter, offset, limit, data.order);
      const totalCount = offset + newItems.length;
      if (totalCount === data.totalCount) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      fetchQuery.current = fetchQuery.previous;
    }
  };

  const noSearchResult = fetchQuery.current && !data.items.length && !hasMore;

  return (
    <div className={tw`${props.className}`}>
      {noSearchResult && (
        <div className={tw`absolute mt-24 pl-[50%]`}>
          <Img
            className={tw`rounded-xl -translate-x-[50%] w-[360px] h-[360px]`}
            src="/no-search-result.webp"
            alt="no-search-result"
          />
        </div>
      )}
      {data.items.map((item, index) => props.onRenderItem(item, index))}
      {props.children}
      <InView onChange={(inView) => inView && void fetchMore()}>
        {({ ref }) => <div ref={ref} className={tw`w-full h-8`} />}
      </InView>
    </div>
  );
}
