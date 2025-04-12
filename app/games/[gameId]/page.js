'use client';
// PAGE TO EDIT GAME DETAILS
import { useEffect, useState } from 'react';

import { useFilter } from '@/providers/FilterProvider';
import { useUniversalData } from '@/hooks/useUniversalData';
import { use } from 'react';

import * as tableFields from '@/lib/tables';
import Form from '@/components/ui/Form';

import Spinner from '@/components/ui/Spinner';
import Details from '@/components/ui/Details';

import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import { useLeagueDetailsData } from '@/hooks/useLeagueDetails';

function GameEdit({ params }) {
  const { gameId } = use(params);
  const { leagueId, seasonId, divisionId, dlid } = useFilter();
  const [teamValues, setTeamValues] = useState({
    home_team_id: '',
    away_team_id: '',
  });

  const { teamsLeagues: teams } = useLeagueDetailsData(
    leagueId,
    seasonId,
    divisionId,
  );
  const fields = tableFields.gamesColumns.filter(
    (field) => field.editable !== false,
  );

  const {
    isLoading,
    error,
    data: game,
  } = useUniversalData({
    table: 'games',
    filter: { id: gameId },
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!game) return;
    setTeamValues({
      home_team_id: game[0].home_team_id,
      away_team_id: game[0].away_team_id,
    });
  }, [game]);

  if (isLoading) return <Spinner />;
  if (error) return <p>Error fetching data</p>;

  const record = game && game.length > 0 ? game[0] : null; // Get the first item, or null if empty

  teams.sort((a, b) => a.name.localeCompare(b.name));
  const teamsArray = teams.map((team) => ({
    value: team.team_id,
    name: team.name,
  }));
  if (!record) return <p>No record found</p>;
  function handleChange(e) {
    setTeamValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <>
      <HeaderIndividualPage
        title={record.name}
        description={record.description}
      />
      <div className="flex-centered-columns">
        <div className="center-column">
          {isUpdating ? (
            <Form
              fields={fields}
              table={'games'}
              initialData={{
                ...game[0],
                division_id: dlid,
                home_team_id: {
                  value: teamValues.home_team_id,
                  handleSelectChange: handleChange,
                  selectOptions: [...teamsArray],
                },
                away_team_id: {
                  value: teamValues.away_team_id,
                  handleSelectChange: handleChange,
                  selectOptions: [...teamsArray],
                },
              }}
              buttonText="Update"
            />
          ) : (
            <div>
              <Details
                label={'games'}
                columns={'gamesColumns'}
                data={record}
                handleChange={() => setIsUpdating((prev) => !prev)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GameEdit;
