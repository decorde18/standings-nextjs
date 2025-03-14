import { useEffect, useState } from 'react';
import { useUniversalData } from './useUniversalData';

export function useLeagueDetailsData(leagueId, seasonId, divisionId) {
  // ✅ Call hooks at the top level
  const {
    data: leaguesData,
    error: leaguesError,
    create,
    delete: deleteRecord,
  } = useUniversalData({
    table: 'leagues',
    filter: { id: leagueId },
  });
  const { data: divisionsLeagueData, error: divisionsLeagueError } =
    useUniversalData({
      table: 'divisions_leagues',
      filter: {
        ...(leagueId && { league_id: leagueId }),
        ...(seasonId && { season_id: seasonId }),
      },
    });
  const { data: divisionsData, error: divisionsError } = useUniversalData({
    table: 'divisions',
  });
  const { data: seasonsData, error: seasonsError } = useUniversalData({
    table: 'seasons',
  });
  const { data: teamsData, error: teamsError } = useUniversalData({
    table: 'teams',
  });
  const { data: teamsLeaguesData, error: teamsLeaguesError } = useUniversalData(
    {
      table: 'team_leagues',
    }
  );

  // ✅ Track loading state manually
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      leaguesData &&
      divisionsLeagueData &&
      divisionsData &&
      seasonsData &&
      teamsData &&
      teamsLeaguesData
    ) {
      setIsLoading(false);
    }
  }, [
    leaguesData,
    divisionsLeagueData,
    divisionsData,
    seasonsData,
    teamsData,
    teamsLeaguesData,
  ]);

  return {
    league: leaguesData?.[0] || null, // Get the first item or null
    leagues: leaguesData || null, // Get the first item or null
    divisionsLeague: divisionsLeagueData || [],
    divisions: divisionsData || [],
    seasons: seasonsData || [],
    teams: teamsData || [],
    teamsLeagues: teamsLeaguesData || [],
    isLoading,
    create,
    deleteRecord,
    error:
      leaguesError ||
      divisionsLeagueError ||
      divisionsError ||
      seasonsError ||
      teamsError ||
      teamsLeaguesError ||
      null, // Combine errors
  };
}
