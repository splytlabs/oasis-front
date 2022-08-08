import runPostgrestQuery from '../lib/run-postgrest-query';
import { FilterState, useFilter } from './useFilter';
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { debounce } from 'lodash';

type DataState = {
  items: unknown[];
  totalCount: number;
  order: string;
  expectedTotalCount?: number;
};

const QueryDispatchContext = createContext<{
  fetch: (
    filter: FilterState,
    offset?: number,
    limit?: number,
    order?: string
  ) => Promise<unknown[]>;
  fetchAndClearPrevious: (
    filter: FilterState,
    order?: string,
    limit?: number
  ) => Promise<unknown[]>;
  getQueryString: (
    filter: FilterState,
    offset?: number,
    limit?: number,
    order?: string
  ) => string;
  setOrder: (order: string) => void;
}>({
  // eslint-disable-next-line @typescript-eslint/require-await
  fetch: async () => [],
  getQueryString: () => '',
  // eslint-disable-next-line @typescript-eslint/require-await
  fetchAndClearPrevious: async () => [],
  setOrder: () => undefined,
});

const QueryStateContext = createContext<DataState>({
  items: [],
  totalCount: 0,
  order: '',
});

const getFilterQuery = (
  filter: FilterState,
  offset?: number,
  limit?: number,
  order?: string
) => {
  const head = 'rest/v1/rental_infos_view?select=*';
  const body = [...filter.values()].reduce((filterString, map) => {
    return filterString + [...map.values()].filter((x) => x).join('&');
  }, '');

  const filterString = `${head}${!body ? '' : `&${body}`}`;

  const queryParts = [
    filterString,
    `order=${order || 'price.desc.nullslast'},id.desc.nullslast`,
    `limit=${limit ?? 20}`,
    `offset=${offset ?? 0}`,
  ];
  return queryParts.filter((x) => x).join('&');
};

export const QueryProvider: React.FC<{
  children: ReactElement[] | ReactElement;
}> = ({ children }) => {
  const [data, setData] = useState<DataState>({
    items: [],
    totalCount: 0,
    order: '',
  });
  const { filter } = useFilter();

  const fetch = useCallback(
    async (
      filter: FilterState,
      offset?: number,
      limit?: number,
      order?: string
    ) => {
      const query = getFilterQuery(filter, offset, limit, order);
      const result = await runPostgrestQuery(query, {
        count: 'exact',
      });
      setData((prev) => {
        return {
          ...prev,
          items: [...prev.items, ...result.items],
          totalCount: result.totalCount || 0,
        };
      });
      return result.items;
    },
    []
  );

  const fetchAndClearPrevious = useCallback(
    async (filter: FilterState, order?: string, limit?: number) => {
      const query = getFilterQuery(filter, 0, limit, order);
      const result = await runPostgrestQuery(query, {
        count: 'exact',
      });

      setData((prev) => {
        return {
          ...prev,
          order: order ?? prev.order,
          items: [...result.items],
          totalCount: result.totalCount || 0,
        };
      });
      return result.items;
    },
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCount = useCallback(
    debounce(async (filter: FilterState) => {
      try {
        const query = getFilterQuery(filter);
        const result = await runPostgrestQuery(query, {
          count: 'exact',
          method: 'HEAD',
        });

        setData((prev) => {
          return {
            ...prev,
            expectedTotalCount: result.totalCount || 0,
          };
        });
      } catch (error) {
        console.error('error', error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    void fetchCount(filter);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const setOrder = useCallback(
    (order: string) => {
      void fetchAndClearPrevious(filter, order);
    },
    [fetchAndClearPrevious, filter]
  );

  const dispatch = useMemo(
    () => ({
      fetch,
      getQueryString: getFilterQuery,
      setOrder,
      fetchAndClearPrevious,
    }),
    [fetch, setOrder, fetchAndClearPrevious]
  );

  return (
    <QueryDispatchContext.Provider value={dispatch}>
      <QueryStateContext.Provider value={data}>
        {children}
      </QueryStateContext.Provider>
    </QueryDispatchContext.Provider>
  );
};

export const useQuery = () => {
  const data = useContext(QueryStateContext);
  const { fetch, getQueryString, fetchAndClearPrevious, setOrder } =
    useContext(QueryDispatchContext);

  return {
    data,
    fetch,
    getQueryString,
    fetchAndClearPrevious,
    setOrder,
  };
};
