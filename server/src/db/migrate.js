const fs = require('fs');
const path = require('path');
const { db } = require('./database');

function runMigrations() {
  console.log('Running database migrations...');
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schemaSql);
  console.log('Migrations executed successfully!');
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
