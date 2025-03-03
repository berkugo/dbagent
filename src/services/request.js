import invoker from '../utils/tauri/invoker';

/**
 * Fetches table data from the database
 * @param {string} connection_id - The connection id
 * @param {string} schema - The database schema name
 * @param {string} table - The table name
 * @param {number} limit - Maximum number of rows to fetch
 * @param {number} offset - Number of rows to skip
 * @returns {Promise<{columns: Array, rows: Array, total_rows: number}>} Table data
 */
export const getTableData = async (connection_id, schema, table, limit = 100, offset = 0) => {
  try {
    console.log("connection_id", connection_id);
    const result = await invoker('get_table_data', { 
      connectionId: connection_id,
      schema, 
      table, 
      limit, 
      offset 
    });
    
    return result;
  } catch (error) {
    console.error('Failed to fetch table data:', error);
    throw error;
  }
};

/**
 * Additional database request functions can be added here
 */
