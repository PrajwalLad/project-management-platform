const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { createSessionCookie, clearSessionCookie } = require('../middleware/auth');

function toPublicUser(row) {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    workspaceIds: (row.workspace_ids || []).map(String),
  };
}

const workspaceIdsSelect = 'ARRAY(SELECT wm.workspace_id::text FROM workspace_members AS wm WHERE wm.user_id = u.id ORDER BY wm.workspace_id) AS workspace_ids';

async function register(req, res) {
  const { name, email, password } = req.body || {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and no more than 72 UTF-8 bytes.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [cleanName, cleanEmail, passwordHash],
    );
    const user = toPublicUser(result.rows[0]);
    createSessionCookie(res, user.id);
    return res.status(201).json({ user });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    throw error;
  }
}

async function login(req, res) {
  const { email, password } = req.body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!cleanEmail || typeof password !== 'string') {
    return res.status(400).json({ error: 'Enter your email and password.' });
  }

  const result = await pool.query(
    'SELECT u.id, u.name, u.email, u.password_hash, u.created_at, ' + workspaceIdsSelect +
      ' FROM users AS u WHERE u.email = $1',
    [cleanEmail],
  );
  const row = result.rows[0];
  const passwordMatches = row ? await bcrypt.compare(password, row.password_hash) : false;

  if (!passwordMatches) {
    return res.status(401).json({ error: 'Email or password is incorrect.' });
  }

  const user = toPublicUser(row);
  createSessionCookie(res, user.id);
  return res.json({ user });
}

async function getCurrentUser(req, res) {
  const result = await pool.query(
    'SELECT u.id, u.name, u.email, u.created_at, ' + workspaceIdsSelect +
      ' FROM users AS u WHERE u.id = $1',
    [req.authUserId],
  );

  if (!result.rows[0]) {
    clearSessionCookie(res);
    return res.status(401).json({ error: 'This account no longer exists. Please sign in again.' });
  }

  return res.json({ user: toPublicUser(result.rows[0]) });
}

function logout(_req, res) {
  clearSessionCookie(res);
  return res.json({ message: 'Signed out.' });
}

module.exports = { register, login, getCurrentUser, logout };
