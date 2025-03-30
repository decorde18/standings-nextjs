export const tableApis = [
  {
    table: 'leagues',
    view: 'leaguesView',
    query: 'SELECT * FROM leaguesView',
  },
  {
    table: 'seasons',
    view: 'seasons',
    query: 'SELECT * FROM seasons',
  },
  {
    table: 'games',
    view: 'gamesView',
    query: 'SELECT * FROM gamesView',
  },
  {
    table: 'teams',
    query: 'SELECT * FROM teamsView',
  },
  {
    table: 'team_leagues',
    query: 'SELECT * FROM teamLeaguesView',
  },
  {
    table: 'divisions',
    query: 'SELECT * FROM divisions',
  },
  {
    table: 'divisions_leagues',
    query: 'SELECT * FROM divisionsLeagueView',
  },
  {
    table: 'scores',
    query: 'SELECT * FROM scoresView',
  },
  {
    table: 'teamGamesView',
    query: 'SELECT * FROM teamGamesView',
  },
  {
    table: 'standings',
    query: 'SELECT * FROM standingsView',
  },
  {
    table: 'tiebreakers',
    query: 'SELECT * FROM tieBreakersView',
  },
  {
    table: 'tiebreaker_categories',
    query: 'SELECT * FROM tiebreaker_categories',
  },
  {
    table: 'tiebreaker_definitions',
    query: 'SELECT * FROM tiebreaker_definitions',
  },
  {
    table: 'point_system',
    query: 'SELECT * FROM point_system',
  },
];
