const errorCatchingWrapper = require('../middlewares/errorCatchingWrapper');
const User = require('../models/UserModel');
const Workspace = require('../models/WorkspaceModel');

const createWorkspace = errorCatchingWrapper(async (req, res, next) => {
  const userCredentials = req.userCredentials;
  const currentUser = await User.findById(userCredentials._id);
  const ownerID = currentUser._id;
  const name = req.body.name;
  const newWorkspace = new Workspace({ name, ownerID });
  const createdWorkspace = await newWorkspace.save();
  currentUser.Workspaces.push(createdWorkspace._id);
  const updatedUser = await currentUser.save();
  res.status(201).json(createdWorkspace);
});

module.exports = { createWorkspace };
