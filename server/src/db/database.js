const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(__dirname, '../../', process.env.DATABASE_PATH)
  : path.resolve(__dirname, 'accessiaid.sqlite');

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Enable foreign keys and WAL mode for reliability and performance
try {
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');
} catch (e) {
  console.warn('PRAGMA config warning:', e.message);
}

// Helpers for clean querying across the backend
const query = {
  all: (sql, params = []) => {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },
  get: (sql, params = []) => {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  },
  run: (sql, params = []) => {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  },
  exec: (sql) => {
    return db.exec(sql);
  }
};

module.exports = { db, query };
