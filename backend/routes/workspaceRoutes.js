const express = require('express');
const { listWorkspaces, createWorkspace, joinWorkspace } = require('../controllers/workspaceController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', listWorkspaces);
router.post('/', createWorkspace);
router.post('/join', joinWorkspace);

module.exports = router;
