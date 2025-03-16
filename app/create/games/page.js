'use client';
import Error from '@/app/error';
import Form from '@/components/ui/Form';
import { useUniversalData } from '@/hooks/useUniversalData';
import { gamesColumns } from '@/lib/tables';
import { useSearchParams } from 'next/navigation';

function CreateGamePage({ params }) {
  const searchParams = useSearchParams();
  const dlid = searchParams.get('dlid');

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

  if (isLoading || isLoadingTeams) return null;
  if (error || errorTeams) return <Error error={error} />;

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
              handleChange: (e) => e.target.value,
              selectOptions: teamArray,
            },
            away_team_id: {
              handleChange: (e) => e.target.value,
              selectOptions: teamArray,
            },
          }}
          buttonText="Save"
        />
      </div>
    </div>
  );
}
export default CreateGamePage;
