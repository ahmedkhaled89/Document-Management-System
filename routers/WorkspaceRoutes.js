const express = require('express');
const verifyToken = require('../middlewares/verifyUser');
const WorkspaceController = require('../controllers/WorkspaceController');

const workspaceRouter = express.Router();

workspaceRouter.post(
  '/api/workspaces/createworkspace',
  verifyToken,
  WorkspaceController.createWorkspace
);

module.exports = workspaceRouter;
