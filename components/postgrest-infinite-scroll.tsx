import { tw } from 'twind';
import { useCallback, useRef, useState } from 'react';
import { InView } from 'react-intersection-observer';
import Img from 'components/img';
import { useQuery } from 'hooks/useQuery';
import { useFilter } from 'hooks/useFilter';

export type PostgrestInfiniteScrollProps = {
  fetchLimit: number;
  onRenderItem: (item: unknown, index: number) => React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export default function PostgrestInfiniteScroll(
  props: PostgrestInfiniteScrollProps
) {
  const { data, fetch, getQueryString } = useQuery();
  const { filter } = useFilter();
  const [fetchQuery] = useState({ current: '', previous: '' });

  const currentQueryString = useRef('');

  const fetchMore = useCallback(async () => {
    const options = {
      viewName: data.viewName,
      filter,
      offset: data.items.length,
      limit: props.fetchLimit,
      order: data.order ?? '',
    };
    const newQueryString = getQueryString(options);

    if (currentQueryString.current === newQueryString) {
      return;
    }
    currentQueryString.current = newQueryString;
    try {
      await fetch(options);
    } catch (error) {
      console.error(error);
    }
  }, [data, filter, props.fetchLimit, fetch, getQueryString]);

  const noSearchResult = fetchQuery.current && !data.items.length;

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
