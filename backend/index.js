require('dotenv').config();

const fs = require('node:fs/promises');
const path = require('node:path');
const express = require('express');
const cookieParser = require('cookie-parser');
const pool = require('./db/pool');
const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing. Add a random secret to backend/.env.');
}

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);

app.use((error, _req, res, _next) => {
  console.error('API error:', error.message);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

async function start() {
  const schema = (await fs.readFile(path.join(__dirname, 'db', 'schema.sql'), 'utf8')).replace(/^\uFEFF/, '');
  await pool.query(schema);
  await pool.query('SELECT 1');
  app.listen(port, '127.0.0.1', () => {
    console.log('API server listening on port ' + port);
    console.log('PostgreSQL connection is ready.');
  });
}

start().catch((error) => {
  console.error('Could not start the API server:', error.message);
  process.exitCode = 1;
});



