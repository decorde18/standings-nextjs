'use client';

import styles from '@/styles/components/FilterBar.module.css';
import { useUniversalData } from '@/hooks/useUniversalData';
import { useEffect, useState } from 'react';
import Select from '@/components/ui/Select';
import { useFilter } from '@/providers/FilterProvider';

export default function FilterBar() {
  const {
    league,
    setLeague,
    season,
    setSeason,
    division,
    setDivision,

    setDlid,
  } = useFilter();
  const { isLoading, error, data } = useUniversalData({
    table: 'divisions_leagues',
  });

  const [leagueOptions, setLeagueOptions] = useState([]);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;
    const uniqueLeagues = [
      ...new Map(data.map((item) => [item.league_id, item])).values(),
    ];
    setLeagueOptions(
      uniqueLeagues.map((item) => ({
        value: item.league_id,
        name: item.league_name,
      }))
    );
  }, [data]);

  useEffect(() => {
    if (!data || !league) {
      setSeasonOptions([]);
      return;
    }
    const filtered = data.filter((item) => item.league_id === Number(league));
    const uniqueSeasons = [
      ...new Map(filtered.map((item) => [item.season_id, item])).values(),
    ];
    setSeasonOptions(
      uniqueSeasons.map((item) => ({
        value: item.season_id,
        name: `${item.season} ${item.year}`,
      }))
    );
  }, [data, league]);

  useEffect(() => {
    if (!data || !league || !season) {
      setDivisionOptions([]);
      return;
    }
    const filtered = data.filter(
      (item) =>
        item.league_id === Number(league) && item.season_id === Number(season)
    );
    const uniqueDivisions = [
      ...new Map(filtered.map((item) => [item.division_id, item])).values(),
    ];
    setDivisionOptions(
      uniqueDivisions.map((item) => ({
        value: item.division_id,
        name: `D${item.level} ${item.division_name} ${
          item.gender === 'F' ? 'Women' : 'Men'
        }`,
      }))
    );
  }, [data, league, season]);

  const handleLeagueChange = (e) => setLeague(e.target.value);
  const handleSeasonChange = (e) => setSeason(e.target.value);
  const handleDivisionChange = (e) => {
    const newDivision = e.target.value;
    const record = data.find(
      (item) =>
        item.league_id === Number(league) &&
        item.season_id === Number(season) &&
        item.division_id === Number(newDivision)
    );
    if (record) {
      setDlid(String(record.id));
      setDivision(newDivision);
    }
  };

  if (isLoading) return null;
  if (error)
    return (
      <Error
        error={error}
        name="Filter Error"
        message="There is an issue with the Filter"
      />
    );

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Select
            label="LEAGUE"
            options={leagueOptions}
            onChange={handleLeagueChange}
            value={league}
          />
        </li>
        <li>
          <Select
            label="SEASON"
            options={seasonOptions}
            onChange={handleSeasonChange}
            disabled={!league}
            value={season}
          />
        </li>
        <li>
          <Select
            label="DIVISION"
            options={divisionOptions}
            onChange={handleDivisionChange}
            disabled={!league || !season}
            value={division}
          />
        </li>
      </ul>
    </nav>
  );
}
