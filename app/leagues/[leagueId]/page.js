'use client';
import { useState, useEffect } from 'react';

import { useUniversalData } from '@/lib/useUniversalData';
import { use } from 'react';

import * as tableFields from '@/lib/tables';
import Form from '@/components/ui/Form';

import Spinner from '@/components/ui/Spinner';
import Details from '@/components/ui/Details';
import Button from '@/components/ui/Button';
import Table from '@/components/Table';
import HeaderIndividualPage from '@/components/HeaderIndividualPage';
import AddItemButton from '@/components/ui/AddItemButton';
//todo when i add a new division. i need a way for it to redirect, currently there is no way- i think the best is to add a divisions path
//todo because of the divisions path, I can update the logic for adding a division to a league. it should not create a new division, but should create a new league_divisions record
//todo this also starts to create more logic for seasons so i need to select the season for the league before i can view the divisions
function LeagueDetails({ params }) {
  const { leagueId } = use(params); // Accessing params correctly now
  const table = 'leagues';
  const fields = tableFields[table].filter((field) => field.editable !== false);

  const {
    isLoading,
    error,
    data: leagues,
  } = useUniversalData({
    table: 'leagues',
    filter: { id: leagueId },
  });
  const {
    isLoading: isLoadingDivisions,
    error: errorDivisions,
    data: divisions,
  } = useUniversalData({
    table: 'divisionsLeague',
    filter: { league_id: leagueId },
  });

  const league = leagues && leagues.length > 0 ? leagues[0] : null; // Get the first item, or null if empty
  const [isUpdating, setIsUpdating] = useState(false);
  function handleDivisionUpdate() {}
  if (isLoading || isLoadingDivisions) return <Spinner />;
  if (error || errorDivisions) return <p>Error fetching league data</p>;

  if (!league) return <p>No league found</p>;

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
              fields={fields}
              table={table}
              initialData={league}
              buttonText="Update"
            />
          ) : (
            <div>
              <Details
                label="League"
                columns="leaguesColumns"
                data={league}
                handleChange={() => setIsUpdating((prev) => !prev)}
              />
            </div>
          )}
        </div>
        <div>
          <Table columns={tableFields.divisionsColumns} data={divisions} />
          <AddItemButton
            table="divisions"
            label="Add Division"
            queryParams={{ league_id: league.id }}
          />
        </div>
        <div>
          <Details
            label="Divisions"
            columns={'divisionsColumns'}
            data={divisions}
            handleChange={handleDivisionUpdate}
          />
        </div>
      </div>
    </>
  );
}

export default LeagueDetails;
