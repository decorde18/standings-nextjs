'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useLeagueDetailsData } from '@/hooks/useLeagueDetails';
import {
  useSeasonId,
  useDivisionLeagueId,
  useQueryParam,
} from '@/hooks/useQueryParams';
// import { useDivisionLeagueId } from '@/hooks/useDivisionLeagueId';

import {
  addDivisionToLeague,
  addTeamToLeague,
  removeDivisionFromLeague,
  removeTeamFromLeague,
} from '@/lib/leagueActions';
import * as tableFields from '@/lib/tables';

import Form from '@/components/ui/Form';
import Spinner from '@/components/ui/Spinner';
import Details from '@/components/ui/Details';
import Table from '@/components/Table';
import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import AddItemButton from '@/components/ui/AddItemButton';
import Button from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';

function LeagueDetails({ params }) {
  // Get leagueId from params (wrapped in use())
  const { leagueId } = use(params);

  const searchParams = useSearchParams();
  // const dlid = searchParams.get('dlid');
  const seasonid = searchParams.get('season_id');
  // Use the separate season hook as fallback.
  const { value: seasonId, setValue: setSeasonId } = useSeasonId();

  const { value: dlid, setValue: setDlid } = useQueryParam('dlid');
  // const { dlid, setDlid } = useDivisionLeagueId();
  // TODO: go through evaluate dlid and possibly change dlid back to params and then new logic for updating dlid
  // Local state to hold effective values.
  const [effectiveSeason, setEffectiveSeason] = useState('');
  const [effectiveDivision, setEffectiveDivision] = useState('');
  const [localDivision, setLocalDivision] = useState(''); // separate from composite

  const {
    isLoading,
    error,
    league,
    divisions,
    divisionsLeague, // array of records linking league/division/season
    seasons,
    teams,
    teamsLeagues,
    create,
    deleteRecord,
  } = useLeagueDetailsData(leagueId, effectiveSeason, effectiveDivision);
  // Other local state for UI:
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewTeams, setViewTeams] = useState(false);

  useEffect(() => {
    // We'll derive effectiveSeason and effectiveDivision from dlid if available,
    // otherwise we use seasonId and a local division state.
    if (!divisionsLeague || !divisionsLeague.length) return;

    const season = dlid
      ? divisionsLeague.find((div) => div.id === +dlid)?.season_id
      : seasonid;
    if (!season) return;
    setEffectiveSeason(season);
  }, [divisionsLeague, dlid, seasonid]);

  function handleSelectSeason(rowId) {
    // If there's a composite selection, clear it.
    if (dlid) {
      setDlid('');
    }
    setSeasonId(rowId); // This updates the separate season query param.
  }

  const handleAddDivision = async (rowId) => {
    await addDivisionToLeague(create, {
      seasonId: effectiveSeason,
      divisionId: rowId,
      leagueId,
      pointSystemId: league.point_system,
    });
  };

  const handleRemoveDivision = async (rowId) => {
    await removeDivisionFromLeague(deleteRecord, rowId);
  };

  const handleAddTeam = async (rowId) => {
    await addTeamToLeague(create, {
      teamId: rowId,
      divisionId: effectiveDivision,
    });
  };

  const handleRemoveTeam = async (rowId) => {
    await removeTeamFromLeague(deleteRecord, rowId);
  };

  function handleTeamSelect(rowId) {
    // TODO: team selection logic
    console.log('TODO what will we do here');
  }

  function handleView(rowId) {
    // When a division is selected from the table, if composite is in use,
    // clear it so that changes are local.
    if (dlid) {
      setDlid('');
    }
    // Set the effective division (and local division state)
    setEffectiveDivision(rowId);
    setLocalDivision(rowId);
    // Toggle view teams.
    setViewTeams((prev) => !prev);
  }

  if (isLoading) return <Spinner />;
  if (error) return <p>Error fetching league data</p>;
  if (!league) return <p>No league found</p>;

  const divisionColumns = tableFields.divisionsColumns.filter(
    (column) => column.displayNarrow !== false
  );
  const teamsColumns = tableFields.teamsColumns.filter(
    (column) => column.displayNarrow !== false
  );
  const filteredDivisions = divisions.filter(
    (division) => !divisionsLeague.some((dl) => dl.division_id === division.id)
  );
  const filteredTeams = teams.filter(
    (team) => !teamsLeagues.some((dl) => dl.team_id === team.id)
  );
  const filteredTeamLeagues = teamsLeagues.filter(
    (team) => team.league_division_id === effectiveDivision
  );

  return (
    <>
      <HeaderIndividualPage
        title={league.name}
        description={league.description}
      />
      <div className="flex-centered-columns">
        <div className="center-column">
          {isUpdating ? (
            <Form
              fields={tableFields.leaguesColumns.filter(
                (f) => f.editable !== false
              )}
              table="leagues"
              initialData={league}
              buttonText="Update"
            />
          ) : (
            <Details
              label="League"
              columns="leaguesColumns"
              data={league}
              handleChange={() => setIsUpdating((prev) => !prev)}
            />
          )}
          <Table
            columns={tableFields.seasonsColumns}
            data={seasons}
            handleRow={handleSelectSeason}
            rowsPerPage={3}
            selected={effectiveSeason}
          />
          <AddItemButton table="seasons" label="Add Season" />
        </div>
        <div>
          {viewTeams ? (
            <>
              <Table
                columns={tableFields.teamLeaguesColumns}
                data={filteredTeamLeagues}
                handleRow={handleTeamSelect}
                handleDelete={handleRemoveTeam}
              />
              <Button onClick={handleView}>Return To Divisions</Button>
            </>
          ) : (
            <Table
              columns={tableFields.divisionLeagueColumns}
              data={divisionsLeague}
              handleRow={handleView}
              handleDelete={handleRemoveDivision}
            />
          )}
        </div>
        <div>
          {viewTeams ? (
            <>
              <Table
                columns={teamsColumns}
                data={filteredTeams}
                handleRow={handleAddTeam}
              />
              <AddItemButton table="teams" label="Add Team" />
            </>
          ) : (
            <>
              <Table
                columns={divisionColumns}
                data={filteredDivisions}
                handleRow={handleAddDivision}
              />
              <AddItemButton table="divisions" label="Add Division" />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default LeagueDetails;
