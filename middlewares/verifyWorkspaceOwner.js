const User = require('../models/UserModel');
const Workspace = require('../models/WorkspaceModel');
const errorCatchingWrapper = require('./errorCatchingWrapper');

const verifyWorkspaceOwner = errorCatchingWrapper(async (req, res, next) => {
  const workspaceID = req.params.workspaceID;
  const workspace = await Workspace.findById(workspaceID);
  if (!workspace) {
    const error = new Error('this workspace does not exist!');
    return next(error);
  }
  const userCredentials = req.userCredentials;
  const currentUserID = userCredentials._id;
  const currentUser = await User.findById(currentUserID);
  if (!currentUser) {
    return res.status(400).json({ error: 'No user' });
  }
  if (currentUserID !== workspace.ownerID.toString()) {
    const error = new Error('Unauthorized');
    error.status = 403;
    return next(error);
  }
  req.currentUser = currentUser;
  req.workspace = workspace;
  next();
});

module.exports = verifyWorkspaceOwner;
