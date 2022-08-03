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
  items: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  totalCount: number;
};

const QueryDispatchContext = createContext<{
  fetch: (filter: FilterState, length?: number) => void;
}>({
  fetch: () => {
    return;
  },
});

const QueryStateContext = createContext<DataState>({
  items: [],
  totalCount: 0,
});

const getFilterQuery = (filter: FilterState, length = 12) => {
  const head = 'rest/v1/rental_infos_view?select=*';
  const body = [...filter.values()].reduce((filterString, map) => {
    return filterString + [...map.values()].filter((x) => x).join('&');
  }, '');

  const filterString = `${head}${!body ? '' : `&${body}`}`;

  const queryParts = [
    filterString,
    `order=id.desc.nullslast`,
    `limit=12`,
    `offset=${length}`,
  ];

  return queryParts.filter((x) => x).join('&');
};

export const QueryProvider: React.FC<{
  children: ReactElement[] | ReactElement;
}> = ({ children }) => {
  const [data, setData] = useState<DataState>({ items: [], totalCount: 0 });
  const { filter } = useFilter();

  const fetch = useCallback(async (filter: FilterState, length = 12) => {
    try {
      const query = getFilterQuery(filter, length);
      const result = await runPostgrestQuery(query, {
        count: 'exact',
      });

      setData((prev) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          items: [...prev.items, ...result.items],
          totalCount: result.totalCount || 0,
        };
      });
    } catch (error) {
      console.error('error', error);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCount = useCallback(
    debounce(async (filter: FilterState) => {
      try {
        const query = getFilterQuery(filter);
        const result = await runPostgrestQuery(query, {
          count: 'exact',
        });

        setData((prev) => {
          return {
            ...prev,
            totalCount: result.totalCount || 0,
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

  const dispatch = useMemo(() => ({ fetch }), [fetch]);

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
  const { fetch } = useContext(QueryDispatchContext);

  return {
    data,
    fetch,
  };
};
