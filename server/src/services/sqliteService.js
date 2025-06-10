// File: /src/services/sqliteService.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const dbPath = path.join(__dirname, '../../local.sqlite3');
let dbInstance = null;

function getDbInstance() {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('Failed to connect to SQLite:', err);
      else console.log('Connected to SQLite database');
    });
  }
  return dbInstance;
}

function runQuery(query) {
  return new Promise((resolve, reject) => {
    const db = getDbInstance();
    db.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { runQuery };
