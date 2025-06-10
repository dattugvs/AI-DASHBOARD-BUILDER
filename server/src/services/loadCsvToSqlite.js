// File: /src/services/loadCsvToSqlite.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const dbPath = path.join(__dirname, '../../local.sqlite3');
const dataFolder = path.join(__dirname, '../data');
const db = new sqlite3.Database(dbPath);

function createTableAndInsertData(filePath, tableName) {
  return new Promise((resolve, reject) => {
    const headers = [];
    const records = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', async (headerList) => {
        headers.push(...headerList);
        const columns = headers.map(h => `"${h}" TEXT`).join(', ');

        try {
          await new Promise((res, rej) =>
            db.run(`DROP TABLE IF EXISTS ${tableName};`, (err) => err ? rej(err) : res())
          );

          await new Promise((res, rej) =>
            db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns});`, (err) => err ? rej(err) : res())
          );
        } catch (err) {
          reject(err);
        }
      })
      .on('data', (data) => {
        records.push(data);
      })
      .on('end', () => {
        if (headers.length === 0) {
          return reject(new Error(`No headers found in ${filePath}`));
        }

        const placeholders = headers.map(() => '?').join(', ');
        const stmt = db.prepare(`INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${placeholders})`);

        db.serialize(() => {
          records.forEach(row => {
            stmt.run(headers.map(h => row[h]));
          });
          stmt.finalize((err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      })
      .on('error', reject);
  });
}

async function loadAllCSVs() {
  try {
    const files = fs.readdirSync(dataFolder).filter(f => f.endsWith('.csv'));

    for (const file of files) {
      const filePath = path.join(dataFolder, file);
      const tableName = path.basename(file, '.csv');
      console.log(`Loading started for ${file} into ${tableName}`);
      await createTableAndInsertData(filePath, tableName);
      console.log(`Loaded ${file} into ${tableName}`);
    }
  } catch (err) {
    console.error('Error while loading CSVs:', err);
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err);
      } else {
        console.log("Database connection closed.");
      }
    });
  }
}

if (require.main === module) {
  loadAllCSVs().catch(err => console.error('CSV load failed:', err));
}

module.exports = { loadAllCSVs };
