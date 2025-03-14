'use client';

import styles from '@/styles/components/FilterBar.module.css';
import Select from '../ui/Select';
import { useUniversalData } from '@/hooks/useUniversalData';
import { useEffect, useState } from 'react';
import {
  useDivisionLeagueId,
  useSeasonId,
  useLeague,
  useDivision,
} from '@/hooks/useQueryParams';

export default function FilterBar() {
  // State for options arrays for each select field.
  const [leagueOptions, setLeagueOptions] = useState([]);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);

  // Use our query param hooks as our source of truth.
  const { value: dlid, setValue: setDlid } = useDivisionLeagueId();
  const { value: selectedDivision, setValue: setDivision } = useDivision();
  const { value: selectedSeason, setValue: setSeasonId } = useSeasonId();
  const { value: selectedLeague, setValue: setLeagueId } = useLeague();

  // Fetch universal data.
  const { isLoading, error, data } = useUniversalData({
    table: 'divisions_leagues',
  });

  // When a composite id (dlid) exists, pre-populate our filters.
  useEffect(() => {
    if (data && Array.isArray(data) && dlid) {
      const record = data.find((item) => String(item.id) === dlid);
      if (record) {
        // Setting values from the record.
        // (Assumes record.league_id, record.season_id, record.division_id are compatible types.)
        setLeagueId(record.league_id);
        setSeasonId(record.season_id);
        setDivision(record.division_id);
      } else {
        // Clear values if record is not found.
        setDivision('');
        setDlid('');
      }
    }
  }, [data, dlid]);

  // Build league options from the data.
  useEffect(() => {
    if (!data || !Array.isArray(data)) return;
    const opts = Array.from(
      new Map(data.map((item) => [item.league_id, item])).values()
    ).map((item) => ({ value: item.league_id, name: item.league_name }));
    setLeagueOptions(opts);
  }, [data]);

  // Build season options based on the selected league.
  useEffect(() => {
    if (!data || !Array.isArray(data) || !selectedLeague) {
      setSeasonOptions([]);
      return;
    }
    const filtered = data.filter(
      (item) => item.league_id === Number(selectedLeague) // Consider storing as string
    );
    const opts = Array.from(
      new Map(filtered.map((item) => [item.season_id, item])).values()
    ).map((item) => ({
      value: item.season_id,
      name: `${item.season} ${item.year}`,
    }));
    setSeasonOptions(opts);
  }, [data, selectedLeague]);

  // Build division options based on selected league and season.
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

  // Event handlers update the query params via our hooks.
  const handleLeagueChange = (e) => {
    const newLeague = e.target.value;
    // Clear dependent fields immediately.
    setDlid('');
    setDivision('');
    setSeasonId('');
    setLeagueId(newLeague);
  };

  const handleSeasonChange = (e) => {
    const newSeason = e.target.value;
    // Clear dependent fields.
    setDlid('');
    setDivision('');
    setSeasonId(newSeason);
  };

  const handleDivisionChange = (e) => {
    const newDivision = e.target.value;
    // Look up the composite record to update dlid.
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

  // Early return if data is not loaded or an error occurred.
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
