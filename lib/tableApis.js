export const tableApis = [
  {
    table: 'leagues',
    view: 'leaguesView',
    query: 'SELECT * FROM leaguesView',
    // searchableColumns: ['name'],
    // sortableColumns: ['name', 'created_at'],
  },
  {
    table: 'games',
    view: 'gamesView',
    query: 'SELECT * FROM gamesView',
    // searchableColumns: ['team1', 'team2'],
    // sortableColumns: ['date'],
  },
  {
    table: 'teams',
    query: 'SELECT * FROM teams',
    // searchableColumns: ['name'],
    // sortableColumns: ['name', 'rank'],
  },
  {
    table: 'divisions',
    query: 'SELECT * FROM divisions',
    // searchableColumns: ['name'],
    // sortableColumns: ['name', 'rank'],
  },
  {
    table: 'divisionsLeague',
    query: 'SELECT * FROM leagueDivisionsView',
    // searchableColumns: ['name'],
    // sortableColumns: ['name', 'rank'],
  },
];
