const { randomBytes } = require('node:crypto');
const pool = require('../db/pool');

function toWorkspace(row) {
  return {
    id: String(row.id),
    name: row.name,
    role: row.role,
    inviteCode: row.invite_code || null,
    createdAt: row.created_at,
  };
}

async function listWorkspaces(req, res) {
  const result = await pool.query(
    "SELECT w.id, w.name, w.created_at, wm.role, " +
      "CASE WHEN wm.role IN ('owner', 'admin') THEN w.invite_code ELSE NULL END AS invite_code " +
      'FROM workspace_members AS wm ' +
      'JOIN workspaces AS w ON w.id = wm.workspace_id ' +
      'WHERE wm.user_id = $1 ORDER BY w.created_at DESC',
    [req.authUserId],
  );

  return res.json({ workspaces: result.rows.map(toWorkspace) });
}

async function createWorkspace(req, res) {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ error: 'Workspace name must be between 2 and 80 characters.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const inviteCode = randomBytes(6).toString('hex').toUpperCase();
    const workspaceResult = await client.query(
      'INSERT INTO workspaces (name, invite_code, owner_id) VALUES ($1, $2, $3) RETURNING id, name, created_at',
      [name, inviteCode, req.authUserId],
    );
    const workspace = workspaceResult.rows[0];

    await client.query(
      'INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)',
      [workspace.id, req.authUserId, 'owner'],
    );
    await client.query('COMMIT');

    return res.status(201).json({
      workspace: toWorkspace({ ...workspace, role: 'owner', invite_code: inviteCode }),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function joinWorkspace(req, res) {
  const inviteCode = typeof req.body?.inviteCode === 'string'
    ? req.body.inviteCode.trim().toUpperCase()
    : '';

  if (!/^[A-F0-9]{12}$/.test(inviteCode)) {
    return res.status(400).json({ error: 'Enter a valid 12-character workspace invite code.' });
  }

  const workspaceResult = await pool.query(
    'SELECT id, name, created_at FROM workspaces WHERE invite_code = $1',
    [inviteCode],
  );
  const workspace = workspaceResult.rows[0];
  if (!workspace) {
    return res.status(404).json({ error: 'No workspace was found for that invite code.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, 'member') " +
        'ON CONFLICT (workspace_id, user_id) DO NOTHING',
      [workspace.id, req.authUserId],
    );
    const membershipResult = await client.query(
      'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
      [workspace.id, req.authUserId],
    );
    await client.query('COMMIT');

    return res.json({
      workspace: toWorkspace({
        ...workspace,
        role: membershipResult.rows[0].role,
        invite_code: membershipResult.rows[0].role === 'owner' ? inviteCode : null,
      }),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { listWorkspaces, createWorkspace, joinWorkspace };

