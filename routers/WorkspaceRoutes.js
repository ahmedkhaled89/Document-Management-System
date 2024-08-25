const express = require('express');
const verifyToken = require('../middlewares/verifyUser');
const WorkspaceController = require('../controllers/WorkspaceController');
const verifyWorkspaceOwner = require('../middlewares/verifyWorkspaceOwner');

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
  .get(WorkspaceController.retrieveWorkspace)
  .patch(verifyWorkspaceOwner, WorkspaceController.updateWorkspace)
  .delete(verifyWorkspaceOwner, WorkspaceController.deleteWorkspace);

module.exports = workspaceRouter;
