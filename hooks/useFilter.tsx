import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type Filter = {
  name: string,
  type: string,
}

type FilterData = {
  [key: string]: Filter[]
}

const MOCK_FILTER_DATA: FilterData = {
  basic: [],
  appearance: [],
  properties: [
    {name: "Speed", type: "number"},
    {name: "Power", type: "number"},
    {name: "Stamina", type: "number"},
    {name: "Grit", type: "number"},
    {name: "Intellect", type: "number"},
    {name: "Runaway Runner", type: "grade"},
    {name: "Front Runner", type: "grade"},
    {name: "Stalker", type: "grade"},
    {name: "Stretch Runner", type: "grade"},
  ]
}

type FilterSetDispatcher = (category: string, name: string, value: string) => void;
type FilterResetDispatcher = (category: string) => void;
type FilterResetAllDispatcher = () => void;

type FilterState = Map<string, Map<string, string>>

export const FilterDispatchContext = createContext<{ set: FilterSetDispatcher, reset: FilterResetDispatcher, resetAll: FilterResetAllDispatcher }>({
  set: () => {return},
  reset: () => {return},
  resetAll: () => {return},
});

export const FilterStateContext = createContext<FilterState>(new Map());

export const FilterProvider: React.FC<{ children: ReactNode[]}> = ({children}) => {
  const [filter, setFilter] = useState<FilterState>(buildFilterState(MOCK_FILTER_DATA));

  const set = useCallback((category: string, name: string, value: string) => {
    setFilter(filter => {
      const newFilter = copyFilterState(filter);

      if (newFilter.get(category)?.has(name)) {
        newFilter.get(category)?.set(name, value);
      }

      return newFilter;
    })
  }, []);

  const reset = useCallback((category: string) => {
    setFilter(filter => {
      const newFilter = buildFilterState(MOCK_FILTER_DATA);

      [...filter.entries()].forEach(([k, map]) => {
        if (k !== category) {
          newFilter.set(k, copyMap(map));
        }
      })

      return newFilter;
    })
  }, []);

  const resetAll = useCallback(() => {
    setFilter(() => buildFilterState(MOCK_FILTER_DATA));
  }, []);

  const dispatch = useMemo(() => ({set, reset, resetAll}), [set, reset, resetAll]);

  return (
    <FilterDispatchContext.Provider value={dispatch}>
      <FilterStateContext.Provider value={filter}>
        {children}
      </FilterStateContext.Provider>
    </FilterDispatchContext.Provider>
  );
};

export const useFilter = () => {
  const filter = useContext(FilterStateContext);
  const {set, reset, resetAll} = useContext(FilterDispatchContext);

  const setFilter = useCallback((category: string, name: string, value: string) => {
    set(category, name, value);
  }, [set]);

  const resetFilter = useCallback((category: string) => {
    reset(category);
  }, [reset]);

  const resetAllFilter = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const getFilterQuery = useCallback(() => {
    const head = '/rest/v1/nft_infos?select=id,name,image';
    const body = [...filter.values()].reduce((filterString, map) => {
      return filterString + [...map.values()].filter(x => x).join('&');
    }, '');

    return `${head}${!body ? '' : `&${body}`}`;
  }, [filter])

  const getFilterCount = useCallback((category: string) => {
    const map = filter.get(category);
    if (map) {
      return countNotEmptyValue(map);
    }

    return 0;
  }, [filter]);

  const getFilterCountAll = useCallback(() => {
    return [...filter.values()].reduce((count, map) => {
      return count + countNotEmptyValue(map);
    }, 0)
  }, [filter]);

  return {
    filter,
    setFilter,
    resetFilter,
    resetAllFilter,
    getFilterQuery,
    getFilterCount,
    getFilterCountAll,
  };
};

function countNotEmptyValue(map: Map<unknown, unknown>): number {
  return [...map.values()].filter(x => x).length;
}

function buildFilterState(filterData: FilterData): FilterState {
  return Object.entries(filterData).reduce((filterState, filter) => {
    const [key, values] = filter

    const filterMap = values.reduce((map, f) => {
      map.set(f.name, '');

      return map;
    }, new Map() as Map<string, string>);

    filterState.set(key, filterMap);

    return filterState;
  }, new Map() as FilterState);
}

function copyFilterState(state: FilterState): FilterState {
  return [...state.entries()].reduce((newState, [category, map]) => {
    newState.set(category, copyMap(map));
    return newState;
  }, new Map() as FilterState);
}

function copyMap<T extends Map<unknown, unknown>>(original: T): T {
  return [...original.entries()].reduce((clone, [name, value]) => {
    clone.set(name, value);
    return clone;
  }, new Map() as T);
}
