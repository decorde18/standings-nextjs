import db from './db';

export const getData = async function (table, params = {}) {
  let query;
  let queryParams = [];

  switch (table) {
    case 'leagues':
      query = 'SELECT * FROM leagues';
      break;
    case 'leaguesView':
      query = 'SELECT * FROM leaguesView';
      break;
    case 'teams':
      query = 'SELECT * FROM teams';
      break;
    default:
      return { error: 'Invalid table name' };
  }

  // Add parameters to the query if provided
  if (Object.keys(params).length > 0) {
    const conditions = [];
    for (const [key, value] of Object.entries(params)) {
      conditions.push(`${key} = ?`);
      queryParams.push(value);
    }
    query += ' WHERE ' + conditions.join(' AND ');
  }

  try {
    const [data] = await db.query(query, queryParams); // Fetch data with parameters
    return data; // Return JSON response
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: error.message };
  }
};

export const postData = async function (table, data) {
  let query;
  let queryParams = [];

  switch (table) {
    case 'leagues':
      query = 'INSERT INTO leagues SET ?';
      break;
    case 'teams':
      query = 'INSERT INTO teams SET ?';
      break;
    default:
      return { error: 'Invalid table name' };
  }

  try {
    const [result] = await db.query(query, data); // Insert data
    return { success: true, insertId: result.insertId }; // Return success response with insert ID
  } catch (error) {
    console.error('Error inserting data:', error);
    return { error: error.message };
  }
};
