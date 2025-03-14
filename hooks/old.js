import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useQueryParam(key) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isClient = typeof window !== 'undefined';

  // Initialize value from query params or localStorage
  const [value, setValue] = useState(() => {
    if (!isClient) return '';
    return searchParams.get(key) || localStorage.getItem(key) || '';
  });

  useEffect(() => {
    if (!isClient) return;

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      localStorage.setItem(key, value);
      newParams.set(key, value);
    } else {
      localStorage.removeItem(key);
      newParams.delete(key);
    }

    // Update URL without reloading
    router.replace(`${window.location.pathname}?${newParams.toString()}`);
  }, [value, isClient]);

  return { value, setValue };
}

// Specific hooks for league, season, and divisionLeagueId
export function useSeasonId() {
  return useQueryParam('season_id');
}

export function useLeague() {
  return useQueryParam('league');
}

export function useDivisionLeagueId() {
  return useQueryParam('dlid');
}
