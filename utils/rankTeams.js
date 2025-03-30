// Main ranking function.
// config options include:
// - tiebreakers: array of objects like { category_key : "goalDifference", priority: 1 }.
// - tiebreakerStyle: "exhaustive" or "dynamic".
// - headToHeadResults: an object mapping team names to opponents and wins.
// - headToHeadStyle: "exhaustive" or "dynamic" (for future extension).
// - headToHeadSkipForMultiple: if true (1), skip head-to-head if more than 2 teams are tied.
export default function rankTeams(teams, config) {
  const {
    tiebreakers = [],
    tiebreakerStyle = 'exhaustive', // or "dynamic"
    headToHeadResults = null,
    headToHeadStyle = 'exhaustive', // or "dynamic"
    headToHeadSkipForMultiple = 1,
  } = config;

  const priority = 0;
  // add rank and score to each object
  teams = teams.map((team) => ({
    ...team,
    score: [],
    rank: 1,
    head_to_head: 0,
    tiebreakerBrokenOn: [],
  }));
  console.log(teams);
  // --- STEP 1: SORT TEAMS BY POINTS AND ASSIGN BASE RANKS
  const sortedTeams =
    tiebreakerStyle === 'dynamic'
      ? sortAndRankDynamic(teams, priority)
      : sortAndRankExhaustive(teams, priority);

  // const sortedTeams = sortAndRankTeams(teams, priority);
  // --- STEP 2: ASSIGN RANKS BASED ON LAST SORT
  // --- STEP 3: FIND AND GROUP TEAMS WITH IDENTICAL RANKS
  // --- STEP 4: APPLY NEXT TIEBREAKER TO TEAMS STILL TIED
  // --- STEP 5: REPEAT 2-4 UNTIL ALL TEAMS ARE RANKED OR ALL TIEBREAKERS ARE EXHAUSTED
  // --- STEP 6: GET FINAL RANKINGS
  function sortAndRankDynamic(teamsArr, currentPriority) {}
  function sortAndRankExhaustive(teamsArr, currentPriority) {
    // --- STEP 1: SORT TEAMS BY POINTS AND ASSIGN BASE RANKS
    // --- STEP 4: APPLY NEXT TIEBREAKER TO TEAMS STILL TIED

    const category_key = tiebreakers[currentPriority].category_key;

    const sortDirection =
      tiebreakers[currentPriority].sortDirection || 'descending';

    if (category_key === 'head_to_head')
      teamsArr = teamsArr.map((team) => ({
        ...team,
        head_to_head: headToHeadBreak(team, teamsArr) || 0,
      }));

    teamsArr = teamsArr.sort((a, b) => {
      const aValue = parseFloat(a[category_key]);
      const bValue = parseFloat(b[category_key]);
      if (sortDirection === 'descending') return bValue - aValue;
      else return aValue - bValue;
    });

    const rankedTeams = rankTeamsForTieBreak(
      teamsArr,
      category_key,
      currentPriority,
    );
    const tiedTeams = groupTeams(rankedTeams, currentPriority);

    if (!determineNextStepExhaustive(tiedTeams, currentPriority))
      return teamsArr;
  }

  function headToHeadBreak(team, teamsArr) {
    if (teamsArr.length > 2 && headToHeadSkipForMultiple) return 0;
    const teamResults = headToHeadResults[team.team_id];

    return teamsArr.reduce((acc, key) => {
      if (teamResults.hasOwnProperty(key.team_id)) {
        acc += teamResults[key.team_id];
      }
      return acc;
    }, 0);
  }

  // --- STEP 2: ASSIGN RANKS BASED ON LAST SORT
  function rankTeamsForTieBreak(teamsArr, category_key, currentPriority) {
    let currentRank = 1;
    for (let i = 0; i < teamsArr.length; i++) {
      if (i > 0 && teamsArr[i][category_key] == teamsArr[i - 1][category_key]) {
        teamsArr[i].score.push(teamsArr[i - 1].score[currentPriority]);
      } else {
        teamsArr[i].score.push(currentRank);
      }
      currentRank++;
    }
    return teamsArr;
  }
  // --- STEP 3: FIND AND GROUP TEAMS WITH IDENTICAL RANKS
  function groupTeams(teamsArr, currentPriority) {
    const groupedTeams = teamsArr.reduce((acc, team) => {
      const score = team.score.join('-');
      if (!acc[score]) acc[score] = [];
      acc[score].push(team);
      return acc;
    }, {});
    // if score is unique, assign the rank to the team
    Object.values(groupedTeams).map((group) => {
      group[0].tiebreakerBrokenOn.push(currentPriority);
    });
    //else send to next tiebreaker
    const tiedTeams = Object.values(groupedTeams).filter(
      (group) => group.length > 1,
    );
    return tiedTeams;
  }
  // --- STEP 5: REPEAT 2-4 UNTIL ALL TEAMS ARE RANKED OR ALL TIEBREAKERS ARE EXHAUSTED
  function determineNextStepExhaustive(tiedTeams, currentPriority) {
    if (currentPriority < tiebreakers.length - 1 && tiedTeams.length) {
      currentPriority++;
      tiedTeams = tiedTeams.map((group) =>
        sortAndRankExhaustive(group, currentPriority),
      );
    } else return 0;
  }
  // --- STEP 6: GET FINAL RANKINGS
  function getFinalRanks(finalTeams) {
    let finalRank = 1;

    // Sort the teams based on the `score` arrays lexicographically
    finalTeams.sort((a, b) => {
      for (let i = 0; i < a.score.length; i++) {
        if (a.score[i] !== b.score[i]) {
          return a.score[i] - b.score[i]; // Sort ascending
        }
      }
      return 0; // Arrays are identical
    });

    // Assign ranks based on sorted scores
    for (let i = 0; i < finalTeams.length; i++) {
      if (
        i > 0 &&
        finalTeams[i].score.join('-') === finalTeams[i - 1].score.join('-')
      ) {
        finalTeams[i].rank = finalTeams[i - 1].rank;
      } else {
        finalTeams[i].rank = finalRank;
      }
      finalRank++;
    }

    return finalTeams;
  }

  return getFinalRanks(sortedTeams);
}
