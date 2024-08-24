const express = require('express');
const verifyToken = require('../middlewares/verifyUser');
const WorkspaceController = require('../controllers/WorkspaceController');

const workspaceRouter = express.Router();

workspaceRouter.all('*', verifyToken);

workspaceRouter.post(
  '/api/workspaces/createworkspace',
  WorkspaceController.createWorkspace
);

workspaceRouter
  .route('/api/workspaces')
  .get(WorkspaceController.getAllWorkspaces);

workspaceRouter
  .route('/api/workspaces/:workspaceID')
  .get(WorkspaceController.retrieveWorkspace);

module.exports = workspaceRouter;
