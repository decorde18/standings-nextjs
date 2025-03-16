'use client';
import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';

import { standingsColumns } from '@/lib/tables';
import { useUniversalData } from '@/hooks/useUniversalData';
import { useSearchParams } from 'next/navigation';

function LeagueStandings() {
  const searchParams = useSearchParams();
  const dlid = searchParams.get('dlid');
  const { data, isLoading, error } = useUniversalData({
    table: 'standings',
    filter: dlid ? { divisions_leagues_id: dlid } : undefined,
  });
  const {
    data: tiebreakers,
    isLoading: isLoadingTieBreakers,
    error: errorTiebreakers,
  } = useUniversalData({
    table: 'tiebreakers',
    filter: dlid ? { division_id: dlid } : undefined,
  });
  const columns = standingsColumns;

  if (isLoading || isLoadingTieBreakers) return <Spinner />;
  if (error || errorTiebreakers)
    return <p className="text-red-500">Error loading data</p>;

  // Sort tiebreakers by priority
  const sortedTiebreakers = tiebreakers.sort((a, b) => a.priority - b.priority);

  // Function to get the value for the team based on a tiebreaker category
  const getTiebreakerValue = (team, category_key) => {
    return team[category_key] !== undefined
      ? parseInt(team[category_key], 10)
      : 0;
  };

  // Function to calculate the total score for a team based on tiebreakers
  const calculateScore = (team) => {
    return sortedTiebreakers.reduce((score, tiebreaker) => {
      const categoryKey = tiebreaker.category_key;
      const value = getTiebreakerValue(team, categoryKey);

      // Adjust the priority scaling (try reducing the influence of priority on the score)
      const priorityScore = Math.pow(10, tiebreaker.priority * -1); // Reducing the impact of priority scaling

      return score + value * priorityScore;
    }, 0);
  };

  // Calculate the score for each team
  data.forEach((team) => {
    team.score = calculateScore(team);
  });

  // Sort teams by their calculated score in descending order
  data.sort((a, b) => b.score - a.score);

  // Initialize rank and a variable to keep track of the last rank assigned
  let rank = 1;

  // Assign ranks based on sorted scores
  for (let i = 0; i < data.length; i++) {
    if (i > 0 && data[i].score === data[i - 1].score) {
      // If the score is the same as the previous team's score, assign the same rank
      data[i].rank = data[i - 1].rank;
    } else {
      // Assign the current rank and increment it
      data[i].rank = rank;
      rank++;
    }
  }

  // Create the newData object to handle dynamic rank and win percentage calculation
  const newData = {
    rank: (teamId) => {
      const team = data.find((team) => team.team_id === teamId);
      return team ? team.rank : null;
    },
    percent: (wins, gamesPlayed) =>
      gamesPlayed ? (wins / gamesPlayed).toFixed(3) : '0.00',
  };

  // Modify data by applying new columns (rank and percent)
  const updatedData = data.map((row) => ({
    ...row,
    rank: newData.rank(row.team_id), // Assign rank dynamically
    percent: newData.percent(row.wins, row.games_played), // Calculate win percentage
  }));

  return <Table columns={columns} data={updatedData} />;
}

export default LeagueStandings;
