const express = require('express');
const verifyToken = require('../middlewares/verifyUser');
const WorkspaceController = require('../controllers/WorkspaceController');

const workspaceRouter = express.Router();

workspaceRouter.post(
  '/api/workspaces/createworkspace',
  verifyToken,
  WorkspaceController.createWorkspace
);

workspaceRouter
  .route('/api/workspaces/:workspaceID')
  .get(WorkspaceController.retrieveWorkspace);

module.exports = workspaceRouter;
