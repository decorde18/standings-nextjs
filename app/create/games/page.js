'use client';
import { useState } from 'react';

import { useFilter } from '@/providers/FilterProvider';

import { useUniversalData } from '@/hooks/useUniversalData';
import { gamesColumns } from '@/lib/tables';

import Form from '@/components/ui/Form';
import Error from '@/app/error';

function CreateGamePage() {
  const { dlid } = useFilter();
  const [teamValues, setTeamValues] = useState({
    home_team_id: '',
    away_team_id: '',
  });

  const {
    data: teams,
    isLoading: isLoadingTeams,
    error: errorTeams,
  } = useUniversalData({
    table: 'teams',
  });
  const { data, isLoading, error } = useUniversalData({
    table: 'team_leagues',
    filter: { league_division_id: dlid },
  });

  const table = 'games';
  const fields = gamesColumns.filter((field) => field.editable !== false);

  const updatedFields = [...fields];
  function handleChange(e) {
    setTeamValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  if (isLoading || isLoadingTeams) return null;
  if (error || errorTeams)
    return (
      <Error
        error={error}
        name="Games Error"
        message="There is an issue with the Games"
      />
    );

  const teamArray = data
    .map((team) => teams.find((tea) => tea.id === team.team_id))
    .map((team) => ({ value: team.id, name: team.name }))
    .sort((a, b) => {
      return a.name.localeCompare(b.name); // Ascending order
    });

  return (
    <div className="flex-centered-columns">
      <div className="center-column">
        <Form
          fields={updatedFields}
          table={table}
          initialData={{
            division_id: dlid,
            home_team_id: {
              value: teamValues.home_team_id,
              handleSelectChange: handleChange,
              selectOptions: [...teamArray],
            },
            away_team_id: {
              value: teamValues.away_team_id,
              handleSelectChange: handleChange,
              selectOptions: [...teamArray],
            },
          }}
          buttonText="Save"
        />
      </div>
    </div>
  );
}
export default CreateGamePage;
