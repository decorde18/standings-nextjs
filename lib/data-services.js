import db from './db';
import { tableApis } from './tableApis';

export const getData = async function (table, params = {}, sort, search) {
  const tableConfig = tableApis.find((tab) => tab.table === table);
  if (!tableConfig) return { error: 'Invalid table name' };

  let query = tableConfig.query;
  let queryParams = [];

  // Add filtering conditions dynamically
  if (params && Object.keys(params).length > 0) {
    const conditions = [];
    for (const [key, value] of Object.entries(params)) {
      conditions.push(`${key} = ?`);
      queryParams.push(value);
    }
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Add search functionality
  if (search && tableConfig.searchableColumns) {
    const searchConditions = tableConfig.searchableColumns.map(
      (col) => `${col} LIKE ?`
    );
    queryParams.push(`%${search}%`);
    query +=
      params.length > 0
        ? ` AND (${searchConditions.join(' OR ')})`
        : ` WHERE (${searchConditions.join(' OR ')})`;
  }

  // Add sorting
  if (sort && tableConfig.sortableColumns?.includes(sort)) {
    query += ` ORDER BY ${sort}`;
  }

  try {
    const [data] = await db.query(query, queryParams);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: error.message };
  }
};

export const postData = async function (table, data) {
  const tableConfig = tableApis.find((tab) => tab.table === table);
  if (!tableConfig) return { error: 'Invalid table name' };

  const columns = Object.keys(data);
  const values = Object.values(data);

  if (columns.length === 0) return { error: 'No data provided' };

  const placeholders = columns.map(() => '?').join(', ');
  const query = `INSERT INTO ${table} (${columns.join(
    ', '
  )}) VALUES (${placeholders})`;

  try {
    const [result] = await db.query(query, values);
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('Error inserting data:', error);
    return { error: error.message };
  }
};
export const updateData = async function (table, id, data) {
  const tableConfig = tableApis.find((tab) => tab.table === table);
  if (!tableConfig) return { error: 'Invalid table name' };

  if (!id) return { error: 'ID is required for updating' };

  const columns = Object.keys(data);
  const values = Object.values(data);

  if (columns.length === 0) return { error: 'No data provided to update' };

  const setClause = columns.map((col) => `${col} = ?`).join(', ');
  const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  values.push(id); // Add ID to parameters

  try {
    const [result] = await db.query(query, values);
    return result.affectedRows > 0
      ? { success: true }
      : { error: 'No record found or no changes made' };
  } catch (error) {
    console.error('Error updating data:', error);
    return { error: error.message };
  }
};
export const deleteData = async function (table, id) {
  const tableConfig = tableApis.find((tab) => tab.table === table);
  if (!tableConfig) return { error: 'Invalid table name' };

  if (!id) return { error: 'ID is required for deletion' };

  const query = `DELETE FROM ${table} WHERE id = ?`;

  try {
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0
      ? { success: true }
      : { error: 'No record found to delete' };
  } catch (error) {
    console.error('Error deleting data:', error);
    return { error: error.message };
  }
};
