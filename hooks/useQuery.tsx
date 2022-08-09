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
  viewName: string;
  order?: string;
  expectedTotalCount?: number;
  items: unknown[];
  totalCount: number;
};

type QueryOptions = {
  viewName: string;
  filter: FilterState;
  offset?: number;
  limit?: number;
  order?: string;
};

const QueryDispatchContext = createContext<{
  setViewName: (name: string) => void;
  getQueryString: (options: QueryOptions) => string;
  fetch: (options: QueryOptions) => Promise<unknown[]>;
  fetchAndClearPrevious: (options: QueryOptions) => Promise<unknown[]>;
  setOrder: (order: string) => void;
}>({
  setViewName: () => undefined,
  getQueryString: () => '',
  fetch: () => Promise.resolve([]),
  fetchAndClearPrevious: () => Promise.resolve([]),
  setOrder: () => undefined,
});

const QueryStateContext = createContext<DataState>({
  viewName: '',
  order: '',
  items: [],
  totalCount: 0,
});

const getFilterQuery = ({
  viewName,
  filter,
  offset,
  limit,
  order,
}: QueryOptions) => {
  const head = `rest/v1/${viewName}?select=*`;
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
    viewName: '',
    order: '',
    items: [],
    totalCount: 0,
  });
  const { filter, resetAllFilter } = useFilter();

  const fetch = useCallback(async (options: QueryOptions) => {
    const query = getFilterQuery(options);
    const result = await runPostgrestQuery(query, { count: 'exact' });
    setData((prev) => {
      return {
        ...prev,
        items: [...prev.items, ...result.items],
        totalCount: result.totalCount || 0,
      };
    });
    return result.items;
  }, []);

  const fetchAndClearPrevious = useCallback(async (options: QueryOptions) => {
    const query = getFilterQuery(options);
    const result = await runPostgrestQuery(query, { count: 'exact' });
    setData((prev) => {
      return {
        ...prev,
        order: options.order ?? prev.order ?? '',
        items: [...result.items],
        totalCount: result.totalCount || 0,
      };
    });
    return result.items;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCount = useCallback(
    debounce(async (options: QueryOptions) => {
      try {
        const query = getFilterQuery(options);
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
    void fetchCount({ viewName: data.viewName, filter });
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const setViewName = useCallback((name: string) => {
    setData({ viewName: name, items: [], totalCount: 0 });
  }, []);

  useEffect(() => {
    if (data.viewName === 'derbystars_rental_infos_view') {
      resetAllFilter();
    } else {
      filter.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.viewName]);

  const setOrder = useCallback(
    (order: string) => {
      void fetchAndClearPrevious({ viewName: data.viewName, filter, order });
    },
    [fetchAndClearPrevious, data.viewName, filter]
  );

  const dispatch = useMemo(
    () => ({
      setViewName,
      getQueryString: getFilterQuery,
      fetch,
      fetchAndClearPrevious,
      setOrder,
    }),
    [setViewName, fetch, fetchAndClearPrevious, setOrder]
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
  const dispatch = useContext(QueryDispatchContext);

  return {
    data,
    ...dispatch,
  };
};
