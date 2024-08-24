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
  .route('/api/workspaces')
  .get(WorkspaceController.getAllWorkspaces);

workspaceRouter
  .route('/api/workspaces/:workspaceID')
  .get(verifyToken, WorkspaceController.retrieveWorkspace)
  .patch(verifyToken);

module.exports = workspaceRouter;
