export async function addDivisionToLeague(
  create,
  { seasonId, divisionId, leagueId, pointSystemId }
) {
  if (!seasonId || !divisionId || !leagueId) {
    console.error('Missing required parameters for adding a division.');
    return;
  }

  try {
    await create({
      table: 'divisions_leagues',
      data: {
        season_id: seasonId,
        division_id: divisionId,
        league_id: leagueId,
        point_system_id: pointSystemId,
      },
    });
    console.log('✅ League Division created successfully!');
  } catch (err) {
    console.error('❌ Create Error:', err);
  }
}

export async function removeDivisionFromLeague(deleteRecord, rowId) {
  if (!rowId) {
    console.error('❌ Missing division ID for deletion.');
    return;
  }

  try {
    await deleteRecord({ table: 'divisions_leagues', id: rowId });
    console.log('✅ League Division deleted successfully!');
  } catch (err) {
    console.error('❌ Delete Error:', err);
  }
}
export async function addTeamToLeague(create, { divisionId, teamId }) {
  if (!divisionId || !teamId) {
    console.error('Missing required parameters for adding a team.');
    return;
  }

  try {
    await create({
      table: 'team_leagues',
      data: {
        team_id: teamId,
        league_division_id: divisionId,
      },
    });
    console.log('✅ League Team created successfully!');
  } catch (err) {
    console.error('❌ Create Error:', err);
  }
}

export async function removeTeamFromLeague(deleteRecord, rowId) {
  if (!rowId) {
    console.error('❌ Missing team ID for deletion.');
    return;
  }

  try {
    await deleteRecord({ table: 'team_leagues', id: rowId });
    console.log('✅ League Team deleted successfully!');
  } catch (err) {
    console.error('❌ Delete Error:', err);
  }
}
