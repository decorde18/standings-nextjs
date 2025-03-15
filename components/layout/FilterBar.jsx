'use client';

import styles from '@/styles/components/FilterBar.module.css';

import { useUniversalData } from '@/hooks/useUniversalData';
import { useEffect, useState } from 'react';
import {
  useDivisionLeagueId,
  useSeasonId,
  useLeague,
  useDivision,
} from '@/hooks/useQueryParams';
import Select from '@/components/ui/Select';

export default function FilterBar() {
  const [leagueOptions, setLeagueOptions] = useState([]);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);

  const { value: dlid, setValue: setDlid } = useDivisionLeagueId();
  const { value: selectedDivision, setValue: setDivision } = useDivision();
  const { value: selectedSeason, setValue: setSeasonId } = useSeasonId();
  const { value: selectedLeague, setValue: setLeagueId } = useLeague();

  const { isLoading, error, data } = useUniversalData({
    table: 'divisions_leagues',
  });

  useEffect(() => {
    if (data && Array.isArray(data) && dlid) {
      const record = data.find((item) => String(item.id) === dlid);
      if (record) {
        setLeagueId(record.league_id);
        setSeasonId(record.season_id);
        setDivision(record.division_id);
      } else {
        setDivision('');
        setDlid('');
      }
    }
  }, [data, dlid]);

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;
    const opts = Array.from(
      new Map(data.map((item) => [item.league_id, item])).values()
    ).map((item) => ({ value: item.league_id, name: item.league_name }));
    setLeagueOptions(opts);
  }, [data]);

  useEffect(() => {
    if (!data || !Array.isArray(data) || !selectedLeague) {
      setSeasonOptions([]);
      return;
    }
    const filtered = data.filter(
      (item) => item.league_id === Number(selectedLeague)
    );
    const opts = Array.from(
      new Map(filtered.map((item) => [item.season_id, item])).values()
    ).map((item) => ({
      value: item.season_id,
      name: `${item.season} ${item.year}`,
    }));
    setSeasonOptions(opts);
  }, [data, selectedLeague]);

  useEffect(() => {
    if (!data || !Array.isArray(data) || !selectedLeague || !selectedSeason) {
      setDivisionOptions([]);
      return;
    }
    const filtered = data.filter(
      (item) =>
        item.league_id === Number(selectedLeague) &&
        item.season_id === Number(selectedSeason)
    );
    const opts = Array.from(
      new Map(filtered.map((item) => [item.division_id, item])).values()
    ).map((item) => ({
      value: item.division_id,
      name: `D${item.level} ${item.division_name} ${
        item.gender === 'F'
          ? 'Women'
          : item.gender === 'M'
          ? 'Men'
          : item.gender
      }`,
    }));
    setDivisionOptions(opts);
  }, [data, selectedLeague, selectedSeason]);

  const handleLeagueChange = (e) => {
    const newLeague = e.target.value;
    setDlid('');
    setDivision('');
    setSeasonId('');
    setLeagueId(newLeague);
  };

  const handleSeasonChange = (e) => {
    const newSeason = e.target.value;
    setDlid('');
    setDivision('');
    setSeasonId(newSeason);
  };

  const handleDivisionChange = (e) => {
    const newDivision = e.target.value;
    const record = data.find(
      (item) =>
        item.league_id === Number(selectedLeague) &&
        item.season_id === Number(selectedSeason) &&
        item.division_id === Number(newDivision)
    );
    if (record) {
      setDlid(String(record.id));
    }
  };

  if (!data || isLoading) return null;
  if (error) return <div>ERROR</div>;

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Select
            label="LEAGUE"
            name="leagueFilter"
            options={leagueOptions}
            placeholder="Select League"
            onChange={handleLeagueChange}
            value={selectedLeague}
          />
        </li>
        <li>
          <Select
            label="SEASON"
            name="seasonFilter"
            options={seasonOptions}
            placeholder="Select Season"
            onChange={handleSeasonChange}
            disabled={!selectedLeague}
            value={selectedSeason}
          />
        </li>
        <li>
          <Select
            label="DIVISION"
            name="divisionFilter"
            options={divisionOptions}
            placeholder="Select Division"
            onChange={handleDivisionChange}
            disabled={!selectedLeague || !selectedSeason}
            value={selectedDivision}
          />
        </li>
      </ul>
    </nav>
  );
}
