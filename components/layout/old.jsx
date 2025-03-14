'use client';

import styles from '@/styles/components/FilterBar.module.css';
import Select from '../ui/Select';
import { useUniversalData } from '@/hooks/useUniversalData';
import { useEffect, useState } from 'react';
import { useDivisionLeagueId } from '@/hooks/useQueryParams';

export default function FilterBar() {
  // Options for select fields
  const [leagueOptions, setLeagueOptions] = useState([]);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);

  // Local state for current selections
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  // Our composite query parameter hook
  const { dlid, setDlid } = useDivisionLeagueId();

  const { isLoading, error, data } = useUniversalData({
    table: 'divisions_leagues',
  });

  // When data loads and dlid exists, find the record and hydrate state.
  useEffect(() => {
    if (data && Array.isArray(data) && dlid) {
      const record = data.find((item) => String(item.id) === dlid);
      if (record) {
        setSelectedLeague(record.league_id);
        setSelectedSeason(record.season_id);
        setSelectedDivision(record.division_id);
      }
    }
  }, [data, dlid]);

  // Build options for leagues
  useEffect(() => {
    if (!data || !Array.isArray(data)) return;
    const opts = Array.from(
      new Map(data.map((item) => [item.league_id, item])).values()
    ).map((item) => ({
      value: item.league_id,
      name: item.league_name,
    }));
    setLeagueOptions(opts);
  }, [data]);

  // Build season options based on selected league
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
    // If the current selected season isn’t valid, reset it.
    if (!opts.some((o) => o.value === Number(selectedSeason))) {
      setSelectedSeason('');
      setSelectedDivision('');
      setDlid(''); // also clear the composite param
    }
  }, [data, selectedLeague, selectedSeason, setDlid]);

  // Build division options based on selected league and season
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
    if (!opts.some((o) => o.value === Number(selectedDivision))) {
      setSelectedDivision('');
      setDlid('');
    }
  }, [data, selectedLeague, selectedSeason, selectedDivision, setDlid]);

  // Helper to update the composite query parameter
  const updateCompositeQuery = (newLeague, newSeason, newDivision) => {
    // Look up a record that matches the combination
    if (data && Array.isArray(data)) {
      const record = data.find(
        (item) =>
          item.league_id === Number(newLeague) &&
          item.season_id === Number(newSeason) &&
          item.division_id === Number(newDivision)
      );
      if (record) {
        setDlid(String(record.id));
      } else {
        setDlid('');
      }
    }
  };

  // Handlers: when the user changes a field, update local state and then update the composite query
  const handleLeagueChange = (e) => {
    const newLeague = e.target.value;
    setSelectedLeague(newLeague);
    // When league changes, reset season and division.
    setSelectedSeason('');
    setSelectedDivision('');
    updateCompositeQuery(newLeague, '', '');
  };

  const handleSeasonChange = (e) => {
    const newSeason = e.target.value;
    setSelectedSeason(newSeason);
    // Reset division when season changes.
    setSelectedDivision('');
    updateCompositeQuery(selectedLeague, newSeason, '');
  };

  const handleDivisionChange = (e) => {
    const newDivision = e.target.value;
    setSelectedDivision(newDivision);
    updateCompositeQuery(selectedLeague, selectedSeason, newDivision);
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
