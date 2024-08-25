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

const getAllWorkspaces = errorCatchingWrapper(async (req, res, next) => {
  const workspaces = await Workspace.find({}, { __v: 0 })
    .populate('ownerID', 'nationalID firstName lastName -_id ')
    .populate('DocumentsIDs');
  res.status(200).json(workspaces);
});

const updateWorkspace = errorCatchingWrapper(async (req, res, next) => {
  const workspace = req.workspace;
  workspace.set(req.body);
  const updatedWorkspace = await workspace.save();
  res.status(200).json(updatedWorkspace);
});

const deleteWorkspace = errorCatchingWrapper(async (req, res, next) => {
  const workspace = req.workspace;
  const currentUser = req.currentUser;
  const result = await Workspace.findByIdAndDelete(workspace._id);

  console.log(currentUser.Workspaces);
  currentUser.Workspaces = currentUser.Workspaces.filter(
    (id) => id.toString() !== workspace._id.toString()
  );
  await User.findByIdAndUpdate(currentUser._id, {
    $set: {
      Workspaces: currentUser.Workspaces.filter(
        (id) => id.toString() !== workspace._id.toString()
      ),
    },
  });
  res.status(200).json({ deletedWorkspace: result });
});

const retrieveWorkspace = errorCatchingWrapper(async (req, res, next) => {
  const workspaceID = req.params.workspaceID;
  const workspace = await Workspace.findById(workspaceID).populate(
    'DocumentsIDs'
  );
  res.status(200).json(workspace);
});

module.exports = {
  createWorkspace,
  retrieveWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
};
