import runPostgrestQuery from '../lib/run-postgrest-query';
import { useFilter } from './useFilter';
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type DataState = {
  items: any[];
  totalCount: number;
};

const QueryDispatchContext = createContext<{
  fetch: (length?: number) => void;
  fetchCount: () => void;
}>({
  fetch: () => {
    return;
  },
  fetchCount: () => {
    return;
  },
});

const QueryStateContext = createContext<DataState>({
  items: [],
  totalCount: 0,
});

export const QueryProvider: React.FC<{
  children: ReactElement[] | ReactElement;
}> = ({ children }) => {
  const [data, setData] = useState<DataState>({ items: [], totalCount: 0 });
  const { filter, getFilterQuery } = useFilter();

  const buildQuery = useCallback(
    (length = 12) => {
      const filterString = getFilterQuery();

      const queryParts = [
        filterString,
        `order=id.desc.nullslast`,
        `limit=12`,
        `offset=${length}`,
      ];

      return queryParts.filter((x) => x).join('&');
    },
    [getFilterQuery]
  );

  const fetch = useCallback(
    async (length = 12) => {
      try {
        const query = buildQuery(length);
        const result = await runPostgrestQuery(query, {
          count: 'exact',
        });

        setData((prev) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            items: [...prev.items, ...result.items],
            totalCount: result.totalCount || prev.totalCount,
          };
        });
      } catch (error) {
        console.error(error);
      }
    },
    [buildQuery]
  );

  const fetchCount = useCallback(async () => {
    try {
      const query = buildQuery();
      const result = await runPostgrestQuery(query, {
        count: 'exact',
      });

      setData((prev) => {
        return {
          ...prev,
          totalCount: result.totalCount || prev.totalCount,
        };
      });
    } catch (error) {
      console.error(error);
    }
  }, [buildQuery]);

  useEffect(() => {
    void fetchCount();
  }, [filter, fetchCount]);

  const dispatch = useMemo(() => ({ fetch, fetchCount }), [fetch, fetchCount]);

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
  const { fetch, fetchCount } = useContext(QueryDispatchContext);

  return {
    data,
    fetch,
    fetchCount,
  };
};
