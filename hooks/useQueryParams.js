import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useQueryParam(key) {
  const isClient = typeof window !== 'undefined';
  const router = useRouter();

  // On initial render, read from the URL or localStorage.
  const [value, setValue] = useState(() => {
    if (!isClient) return '';
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key) || localStorage.getItem(key) || '';
  });

  useEffect(() => {
    if (!isClient) return;

    // Build new search params from the current URL.
    const searchParams = new URLSearchParams(window.location.search);

    if (value) {
      // Save value in localStorage and update URL.
      localStorage.setItem(key, value);
      searchParams.set(key, value);
    } else {
      // Remove value from localStorage and URL.
      localStorage.removeItem(key);
      searchParams.delete(key);
    }

    // Replace the URL with the updated query parameters using the history API.
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newUrl);

    // Optionally, you can use router.replace(newUrl) if needed.
  }, [value, key, isClient]);

  return { value, setValue };
}

// Specific hooks for each query param.
export function useDivisionLeagueId() {
  return useQueryParam('dlid');
}

export function useSeasonId() {
  return useQueryParam('season_id');
}

export function useLeague() {
  return useQueryParam('league');
}

export function useDivision() {
  return useQueryParam('division');
}
