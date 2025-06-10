// File: /src/config/db.js
require('dotenv').config();
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: process.env.NODE_ENV !== 'production' // Trust only in dev
  },
  pool: {
    max: 10, // Max number of connections
    min: 0,  // Minimum number of connections
    idleTimeoutMillis: 30000 // Close idle connections after 30s
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed', err);
    throw err;
  });

module.exports = { sql, poolPromise };
