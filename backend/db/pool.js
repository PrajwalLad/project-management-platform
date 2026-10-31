const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Copy .env.example to .env and configure your local PostgreSQL connection.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
