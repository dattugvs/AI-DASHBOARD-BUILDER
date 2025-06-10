// File: /src/services/postgresService.js
const { Pool } = require('pg');

let poolInstance;

/**
 * Initializes and returns a singleton Pool instance.
 * Automatically applies SSL config needed for Railway and other cloud providers.
 */
const poolPromise = async () => {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Needed for Railway
      },
    });

    // Optional: test the connection
    await poolInstance.query('SELECT 1');
    console.log('✅ PostgreSQL connected');
  }

  return poolInstance;
};

/**
 * Helper to run a query using the pool
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 */
async function runQuery(text, params = []) {
  const pool = await poolPromise();
  const client = await pool.connect();
  try {
    // console.log('Running query:', text, params);
    const result = await client.query(text, params);
    return { data: result.rows };
  } catch (err) {
    console.error('PostgreSQL query error:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  poolPromise,
  runQuery,
};
