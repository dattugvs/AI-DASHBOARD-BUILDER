const fs = require('fs');
const path = require('path');
const { poolPromise } = require('./postgresService');
const datatypes = require('../data/datatypes'); // <-- import your datatypes.js

const dataFolder = path.join(__dirname, '../data');

async function loadCsvToTable(filePath, tableName) {
  const records = [];
  let headers = [];
  let lineCount = 0;

  // Get column types from datatypes.js
  const tableTypes = datatypes[tableName];
  if (!tableTypes) throw new Error(`No datatypes defined for table ${tableName}`);

  return new Promise((resolve, reject) => {
    const rl = require('readline').createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      lineCount++;
      if (lineCount === 1) {
        headers = line.split(',').map(h => h.trim());
      } else {
        const values = line.split(',');
        const row = {};
        headers.forEach((h, i) => {
          let v = values[i];
          if (v === undefined || v === '' || v === null || v.trim().toUpperCase() === 'NULL') {
            row[h] = null;
          } else {
            row[h] = v;
          }
        });
        records.push(row);
      }
    });

    rl.on('close', async () => {
      if (!headers.length) {
        return reject(new Error('CSV must have headers as first line.'));
      }
      // Convert datatypes array to a map for lookup
      const typeMap = {};
      (tableTypes || []).forEach(col => {
        typeMap[col.columnName] = col.dataType;
      });

      // Build column definitions using the new format
      const columnDefs = headers.map(h => `"${h}" ${typeMap[h] || 'TEXT'}`).join(', ');

      const pool = await poolPromise();

      try {
        await pool.query(`DROP TABLE IF EXISTS "${tableName}";`);
        await pool.query(`CREATE TABLE "${tableName}" (${columnDefs});`);

        if (records.length > 0) {
          const cols = headers.map(col => `"${col}"`).join(', ');
          const valuePlaceholders = records.map((_, rowIdx) => {
            const offset = rowIdx * headers.length;
            const placeholders = headers.map((_, colIdx) => `$${offset + colIdx + 1}`).join(', ');
            return `(${placeholders})`;
          }).join(', ');
          const allValues = records.flatMap(row => headers.map(h => row[h]));
          await pool.query(
            `INSERT INTO "${tableName}" (${cols}) VALUES ${valuePlaceholders};`,
            allValues
          );
        }

        console.log(`✅ Loaded ${records.length} rows into "${tableName}"`);
        resolve();
      } catch (err) {
        console.error(`❌ Error processing ${filePath}:`, err);
        reject(err);
      }
    });

    rl.on('error', reject);
  });
}

async function bootstrapCsvFolder() {
  const files = fs.readdirSync(dataFolder).filter(f => f.endsWith('.csv'));
  for (const file of files) {
    const filePath = path.join(dataFolder, file);
    const tableName = path.basename(file, '.csv');
    console.log(`📦 Loading ${file} → ${tableName}`);
    await loadCsvToTable(filePath, tableName);
  }
  console.log('✅ All CSV files processed');
}

module.exports = { bootstrapCsvFolder };
