import React from 'react';
import { useLocation } from 'react-router-dom';

export interface QueryParams {
  address?: string;
  placeId?: string;
}

// A custom hook that builds on useLocation to parse
// the query string.
export function useQuery<
  T extends { [K in keyof T]?: string | string[] }
>(): T {
  const { search } = useLocation();

  return React.useMemo(() => {
    const query = new URLSearchParams(search);
    return Array.from(query.keys()).reduce((result, key) => {
      const value = query.getAll(key);
      return {
        ...result,
        [key]: (value.length === 1 ? value[0] : value) || undefined,
      };
    }, {} as T);
  }, [search]);
}
