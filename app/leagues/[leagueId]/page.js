'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useLeagueDetailsData } from '@/hooks/useLeagueDetails';
import { useFilter } from '@/providers/FilterProvider';

import {
  addDivisionToLeague,
  addTeamToLeague,
  removeDivisionFromLeague,
  removeTeamFromLeague,
} from '@/lib/leagueActions';

import * as tableFields from '@/lib/tables';

import Spinner from '@/components/ui/Spinner';

import AddItemButton from '@/components/ui/AddItemButton';
import Button from '@/components/ui/Button';
import Table from '@/components/Table';
import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import UpdateLeague from './UpdateLeague';
import SeasonSelector from './SeasonSelector';
import TieBreakers from './TieBreakers';
import Error from '@/app/error';
import Empty from '@/app/empty';
import PointSystemSelector from './PointSystemSelector';

function LeagueDetails({ params }) {
  const router = useRouter();

  const leagueId = use(params).leagueId;
  const searchParams = useSearchParams();

  const {
    league: filteredLeague,
    setLeague,
    season,
    setSeason,
    division,
    setDivision,
    dlid,
    setDlid,
  } = useFilter();

  const [effectiveSeason, setEffectiveSeason] = useState('');
  const [effectiveDivision, setEffectiveDivision] = useState('');
  const [localDivision, setLocalDivision] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewTeams, setViewTeams] = useState(false);
  const [viewTieBreakers, setViewTieBreakers] = useState(false);

  const {
    isLoading,
    error,
    league,
    divisions,
    divisionsLeague,
    seasons,
    teams,
    teamsLeagues,
    create,
    update,
    deleteRecord,
  } = useLeagueDetailsData(leagueId, effectiveSeason, effectiveDivision);

  //if no league searchparams, set it
  useEffect(() => {
    if (!filteredLeague) setLeague(leagueId);
  }, [filteredLeague, leagueId, setLeague]);

  // useEffect(() => {
  //   if (!divisionsLeague?.length) return;
  //   const season = divisionsLeague.find((div) => div.id === +dlid);
  //   setEffectiveSeason(season?.season_id || seasonIdParam);
  //   if (season) setDlid(season);
  // }, [divisionsLeague, dlid, setDlid]);

  async function handleAddDivision(rowId) {
    console.log('div', rowId, 'season', season, 'league', leagueId);
    await addDivisionToLeague(create, {
      seasonId: season,
      divisionId: rowId,
      leagueId,
      pointSystemId: league.point_system,
    });
  }

  async function handleRemoveDivision(rowId) {
    await removeDivisionFromLeague(deleteRecord, rowId);
  }

  async function handleAddTeam(rowId) {
    await addTeamToLeague(create, {
      teamId: rowId,
      divisionId: effectiveDivision,
    });
  }

  async function handleRemoveTeam(rowId) {
    await removeTeamFromLeague(deleteRecord, rowId);
  }

  function handleView(rowId) {
    if (dlid) setDlid('');
    setDivision(rowId);
    setEffectiveDivision(rowId);
    setLocalDivision(rowId);
    setViewTeams((prev) => !prev);
  }
  function handleViewTieBreakers() {
    setViewTieBreakers((prev) => !prev);
  }

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Error
        error={error}
        name="League Error"
        message="There is an issue with the League"
      />
    );
  if (!league)
    return <Empty name="No League Data" message="There is no League" />;

  const filteredSeasons = seasons.filter((item) =>
    divisionsLeague.map((item) => item.season_id).includes(item.id),
  );

  const divisionColumns = tableFields.divisionsColumns.filter(
    (column) => column.displayNarrow !== false,
  );
  const teamsColumns = tableFields.teamsColumns.filter(
    (column) => column.displayNarrow !== false,
  );
  const filteredDivisions = divisions.filter(
    (division) =>
      !divisionsLeague.some(
        (dl) => dl.division_id == division.id && dl.season_id == season,
      ),
  );
  const filteredTeams = teams.filter(
    (team) => !teamsLeagues.some((dl) => dl.team_id === team.id),
  );
  const filteredTeamLeagues = teamsLeagues.filter(
    (team) => team.league_division_id === effectiveDivision,
  );
  const filteredDivisionLeagues = divisionsLeague.filter(
    (div) => div.season_id == season,
  );
  const [filteredDivisionLeague] = filteredDivisionLeagues.filter(
    (div) => div.division_id == division,
  );

  return (
    <>
      <HeaderIndividualPage
        title={league.name}
        description={league.description}
      />
      {
        <div className="flex-centered-columns">
          <div className="center-column">
            <UpdateLeague
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
              league={league}
              tableFields={tableFields}
              redirectPath={window.location.href}
            />
            <SeasonSelector
              isUpdating={isUpdating}
              tableFields={tableFields}
              seasons={filteredSeasons}
              setSeason={setSeason}
              effectiveSeason={season}
            />
          </div>
          {season && (
            <>
              <div>
                {viewTieBreakers ? (
                  <PointSystemSelector
                    tableFields={tableFields}
                    dlid={filteredDivisionLeague}
                    update={update}
                  />
                ) : viewTeams ? (
                  <>
                    <Table
                      columns={tableFields.teamLeaguesColumns}
                      data={filteredTeamLeagues}
                      handleDelete={handleRemoveTeam}
                    />
                    <Button onClick={handleView}>Return To Divisions</Button>
                  </>
                ) : (
                  <>
                    <Table
                      columns={tableFields.divisionLeagueColumns}
                      data={filteredDivisionLeagues}
                      handleRow={handleView}
                      handleDelete={handleRemoveDivision}
                    />
                  </>
                )}
                <Button onClick={handleViewTieBreakers}>
                  {!viewTieBreakers
                    ? 'View/Edit Tie Breakers'
                    : 'Return to Divisions'}
                </Button>
              </div>
              <div>
                {viewTieBreakers ? (
                  <TieBreakers />
                ) : season && viewTeams ? (
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
            </>
          )}
        </div>
      }
    </>
  );
}

export default LeagueDetails;
