import { createContext, useContext, useState, useEffect, useRef } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';
import { useUniversalData } from '@/hooks/useUniversalData';

import Spinner from '@/components/ui/Spinner';

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoading, error, data } = useUniversalData({
    table: 'divisions_leagues',
  });

  const [league, setLeague] = useState(searchParams.get('league') || '');
  const [season, setSeason] = useState(searchParams.get('season') || '');
  const [division, setDivision] = useState(searchParams.get('division') || '');
  const [dlid, setDlid] = useState(searchParams.get('dlid') || '');

  const prevLeague = useRef(league);
  const prevSeason = useRef(season);
  const prevDivision = useRef(division);
  const prevDlid = useRef(dlid);

  useEffect(() => {
    if (!data) return;
    const params = new URLSearchParams();

    const retrievedDlid =
      data.find(
        (item) =>
          item.league_id === Number(league) &&
          item.season_id === Number(season) &&
          item.division_id === Number(division)
      ) ||
      data.find((dl) => dl.id === Number(dlid)) ||
      '';

    // If league changes, reset season, division, and dlid
    if (!league || league != prevLeague.current) {
      setSeason('');
      setDivision('');
      setDlid('');
      localStorage.removeItem('season');
      localStorage.removeItem('division');
      localStorage.removeItem('dlid');
    }
    // If season changes, reset division and dlid, but keep league
    else if (!season || season != prevSeason.current) {
      setDivision('');
      setDlid('');
      localStorage.removeItem('division');
      localStorage.removeItem('dlid');
    }

    // If dlid changes, update related state values
    else if (dlid !== prevDlid.current) {
      if (retrievedDlid) {
        setLeague(String(retrievedDlid.league_id));
        setSeason(String(retrievedDlid.season_id));
        setDivision(String(retrievedDlid.division_id));
        setDlid(String(dlid));
      }
    }

    // Update localStorage and URL parameters
    const updatedValues = { league, season, division, dlid };
    Object.entries(updatedValues).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, value);
        params.set(key, value);
      } else {
        localStorage.removeItem(key);
        params.delete(key);
      }
    });

    // Update URL based on the current path
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/leagues/') && league) {
      router.replace(`/leagues/${league}?${params.toString()}`);
    } else {
      router.replace(`?${params.toString()}`);
    }

    // Store previous values for comparison
    prevLeague.current = league;
    prevSeason.current = season;
    prevDivision.current = division;
    prevDlid.current = dlid;
  }, [league, season, division, dlid, router, data]);

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Error
        error={error}
        name="Provider Error"
        message="There is an issue with the Provider"
      />
    );

  return (
    <FilterContext.Provider
      value={{
        league,
        setLeague,
        season,
        setSeason,
        division,
        setDivision,
        dlid,
        setDlid,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
