import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || './data/issuance.db';
const dbDir = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS credentials (
    id TEXT PRIMARY KEY,
    holder_name TEXT NOT NULL,
    holder_email TEXT NOT NULL,
    credential_type TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    expiry_date TEXT,
    metadata TEXT,
    issued_by TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_holder_email ON credentials(holder_email);
  CREATE INDEX IF NOT EXISTS idx_credential_type ON credentials(credential_type);
`);

export default db;