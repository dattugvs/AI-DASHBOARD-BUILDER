const { poolPromise } = require('../config/db'); // Use the existing poolPromise

async function runSQL(query) {
  try {
    const pool = await poolPromise; // Use the connection pool from db.js
    const result = await pool.request().query(query); // Execute the query
    return { data: result.recordset }; // Return the fetched records
  } catch (err) {
    console.error('SQL execution error:', err);
    throw err;
  }
}

async function runSQLWithPagination(query, pageNumber, pageSize) {
  const offset = (pageNumber - 1) * pageSize;
  const paginatedQuery = `
    WITH Results_CTE AS (
      ${query}
    )
    SELECT * FROM Results_CTE
    ORDER BY SubscriptionID
    OFFSET ${offset} ROWS
    FETCH NEXT ${pageSize} ROWS ONLY;

    WITH Total_CTE AS (
      ${query}
    )
    SELECT COUNT(*) AS Total FROM Total_CTE;
  `;

  const pool = await poolPromise; // Use the connection pool from db.js
  const result = await pool.request().query(paginatedQuery);
  const data = result.recordsets[0];
  const total = result.recordsets[1]?.[0]?.Total || 0;

  return { data, total };
}

module.exports = { runSQL, runSQLWithPagination };