'use client';
import Table from '@/components/Table';
import Spinner from '@/components/ui/Spinner';

import { standingsColumns } from '@/lib/tables';
import { useUniversalData } from '@/hooks/useUniversalData';
import { useSearchParams } from 'next/navigation';
import Error from '../error';
import rankTeams, { possibleTotals } from '@/utils/rankTeams';

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
  const {
    data: tiebreakerCategories,
    isLoading: isLoadingTieBreakersCategories,
    error: errorTiebreakersCategories,
  } = useUniversalData({
    table: 'tiebreaker_categories',
  });
  const {
    data: tiebreakerDefinitions,
    isLoading: isLoadingTieBreakersDefinitions,
    error: errorTiebreakersDefinitions,
  } = useUniversalData({
    table: 'tiebreaker_definitions',
    filter: dlid ? { division_id: dlid } : undefined,
  });
  const {
    data: teamGamesView,
    isLoading: isLoadingteamGamesView,
    error: errorteamGamesView,
  } = useUniversalData({
    table: 'teamGamesView',
    filter: dlid ? { division_league_id: dlid } : undefined,
  });
  const columns = standingsColumns;

  if (
    isLoading ||
    isLoadingTieBreakers ||
    isLoadingTieBreakersCategories ||
    isLoadingTieBreakersDefinitions ||
    isLoadingteamGamesView
  )
    return <Spinner />;
  if (
    error ||
    errorTiebreakers ||
    errorTiebreakersCategories ||
    errorTiebreakersDefinitions ||
    errorteamGamesView
  )
    return <p className="text-red-500">Error loading data</p>;

  // Sort tiebreakers by priority
  const { tiebreakerStyle, headToHeadStyle, headToHeadSkipForMultiple } =
    tiebreakerDefinitions[0];
  function createWinArray(data, teamGamesView) {
    const winArray = {};

    // Initialize winArray with team IDs
    data.forEach((team) => {
      winArray[team.team_id] = {};
      data.forEach((opponent) => {
        if (team.team_id !== opponent.team_id) {
          winArray[team.team_id][opponent.team_id] = 0;
        }
      });
    });

    // Populate winArray with win counts
    teamGamesView.forEach((game) => {
      if (game.result === 'Win') {
        winArray[game.team_id][game.opponent_id]++;
      }
    });

    return winArray;
  }
  const config = {
    tiebreakers,
    headToHeadResults: createWinArray(data, teamGamesView),
    tiebreakerStyle,
    headToHeadStyle,
    headToHeadSkipForMultiple,
  };
  const rankedTeams = rankTeams(data, config);

  // Utility function to compare two teams based on a tiebreaker key
  // function compareTeams(a, b, sortedTiebreakers, headToHeadData = {}) {
  //   for (const tiebreaker of sortedTiebreakers) {
  //     const key = tiebreakerCategories.find(
  //       (cat) => cat.id === tiebreaker.id,
  //     ).category_key; // Category key like 'points', 'goal_difference'
  //     // Special handling for head-to-head
  //     // if (key === 'head_to_head' && a.id && b.id) {
  //     //   const aWins = headToHeadData[a.id]?.[b.id] || 0;
  //     //   const bWins = headToHeadData[b.id]?.[a.id] || 0;

  //     //   if (aWins !== bWins) {
  //     //     return bWins - aWins; // Sort descending by head-to-head wins
  //     //   }
  //     console.log(key);
  //     if (key === 'head_to_head') {
  //       console.log('head to head');
  //     } else {
  //       // Compare normal tiebreaker category
  //       if (a[key] !== b[key]) {
  //         return b[key] - a[key]; // Descending order
  //       }
  //     }
  //   }
  //   return 0; // Teams are tied on all tiebreakers
  // }

  // Function to rank teams with dynamic sorting and tie detection
  // function rankTeams(teams = [], sortedTiebreakers, headToHeadData = {}) {
  //   const sortedTeams = [...teams].sort((a, b) =>
  //     compareTeams(a, b, sortedTiebreakers, headToHeadData),
  //   );

  //   // Assign ranks and handle ties
  //   const rankedTeams = [];
  //   let currentRank = 1;
  //   for (let i = 0; i < sortedTeams.length; i++) {
  // if (
  //   i > 0 &&
  //   compareTeams(
  //     sortedTeams[i],
  //     sortedTeams[i - 1],
  //     sortedTiebreakers,
  //     headToHeadData,
  //   ) === 0
  // ) {
  //   // Tie with the previous team: Assign same rank
  //   rankedTeams.push({ ...sortedTeams[i], rank: currentRank });
  // } else {
  //   // No tie: Assign a new rank
  //   currentRank = i + 1;
  //   rankedTeams.push({ ...sortedTeams[i], rank: currentRank });
  // }
  //   }

  //   return rankedTeams;
  // }

  // Function to get the value for the team based on a tiebreaker category
  // const getTiebreakerValue = (team, category_key) => {
  //   return team[category_key] !== undefined
  //     ? parseInt(team[category_key], 10)
  //     : 0;
  // };

  // // Function to calculate the total score for a team based on tiebreakers
  // const calculateScore = (team) => {
  //   return sortedTiebreakers.reduce((score, tiebreaker) => {
  //     const categoryKey = tiebreaker.category_key;
  //     const value = getTiebreakerValue(team, categoryKey);

  //     // Adjust the priority scaling (try reducing the influence of priority on the score)
  //     const priorityScore = Math.pow(10, tiebreaker.priority * -2); // Reducing the impact of priority scaling

  //     return score + value * priorityScore;
  //   }, 0);
  // };

  // // Calculate the score for each team
  // data.forEach((team) => {
  //   team.score = calculateScore(team);
  // });

  // // Sort teams by their calculated score in descending order
  // data.sort((a, b) => b.score - a.score);

  // // Initialize rank and a variable to keep track of the last rank assigned
  // let rank = 1;

  // // Assign ranks based on sorted scores
  // for (let i = 0; i < data.length; i++) {
  //   if (i > 0 && data[i].score === data[i - 1].score) {
  //     // If the score is the same as the previous team's score, assign the same rank
  //     data[i].rank = data[i - 1].rank;
  //   } else {
  //     // Assign the current rank and increment it
  //     data[i].rank = rank;
  //     rank++;
  //   }
  // }

  // Create the newData object to handle dynamic rank and win percentage calculation
  // const newData = {
  //   rank: (teamId) => {
  //     const team = data.find((team) => team.team_id === teamId);
  //     return team ? team.rank : null;
  //   },
  //   percent: (wins, ties, gamesPlayed) =>
  //     gamesPlayed ? ((wins + 0.5 * ties) / gamesPlayed).toFixed(3) : '0.00',
  // };
  // // Modify data by applying new columns (rank and percent)
  // const updatedData = data.map((row) => ({
  //   ...row,
  //   // rank: newData.rank(row.team_id), // Assign rank dynamically
  //   percent: newData.percent(row.wins, 0.5 * row.ties, row.games_played), // Calculate win percentage
  // }));
  const updatedTeams = rankedTeams.map((team) => ({
    ...team,
    percent: team.games_played
      ? ((+team.wins + 0.5 * +team.ties) / team.games_played).toFixed(3)
      : '0.000',
  }));
  const updatedPossibleTotals = rankedTeams.map((team) => possibleTotals(team));
  console.log(updatedPossibleTotals, config);
  if (!dlid)
    return (
      <Error
        name="No League Selected"
        message="Please select a league to see the standings"
      />
    );
  // if (!rankTeams(data, sortedTiebreakers).length)
  // if (!rankTeams(data, sortedTiebreakers).length)
  // return (
  //   <Error
  //     name="No Scores Reported"
  //     message="Please add scores to the selected divisions"
  //   />
  // );
  // return <Table columns={columns} data={rankTeams(data, sortedTiebreakers)} />;
  return <Table columns={columns} data={updatedTeams} />;
}

export default LeagueStandings;
