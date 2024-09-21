const errorCatchingWrapper = require('../middlewares/errorCatchingWrapper');
const User = require('../models/UserModel');
const Workspace = require('../models/WorkspaceModel');

const createWorkspace = errorCatchingWrapper(async (req, res, next) => {
  const userCredentials = req.userCredentials;
  const currentUser = await User.findById(userCredentials._id);
  const ownerID = currentUser._id;
  const name = req.body.name;
  if (!name || !userCredentials || !currentUser) {
    return res.status(400).json({ error: 'Can not Create WS!' });
  }
  const newWorkspace = new Workspace({ name, ownerID });
  const createdWorkspace = await newWorkspace.save();
  currentUser.Workspaces.push(createdWorkspace._id);
  const updatedUser = await currentUser.save();
  res.status(201).json(createdWorkspace);
});

const getAllWorkspaces = errorCatchingWrapper(async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ deleted: false }, { __v: 0 })
      .populate('ownerID', 'nationalID firstName lastName _id email')
      .populate({
        path: 'DocsIDs',
        match: {
          deleted: { $eq: false, $exists: true },
          updatedAt: { $exists: true },
        },
        options: { sort: { updatedAt: 'desc' } },
      });
    res.status(200).json({ workspaces });
  } catch (error) {
    return res.status(400).json({ error: 'Cant find workspaces' });
  }
});

const updateWorkspace = errorCatchingWrapper(async (req, res, next) => {
  const workspace = req.workspace;
  workspace.set({ name: req.body });
  const updatedWorkspace = await workspace.save();
  res.status(200).json({ updatedWorkspace });
});

const deleteWorkspace = errorCatchingWrapper(async (req, res, next) => {
  const workspace = req.workspace;
  const currentUser = req.currentUser;
  const result = await Workspace.findByIdAndUpdate(workspace._id, {
    deleted: true,
  });

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
  if (!workspaceID) {
    return res.status(400).json({ error: `No workspace ID` });
  }

  const workspace = await Workspace.findById(workspaceID, {})
    .where({ deleted: false })
    .populate({
      path: 'DocsIDs',

      match: {
        deleted: { $eq: false, $exists: true },
        updatedAt: { $exists: true },
      },
      options: { sort: { updatedAt: 'desc' } },
    })
    .populate('ownerID');
  if (!workspace) {
    return res.status(404).json({ error: `Workspace Does Not Exist` });
  }
  res.status(200).json({ status: 'SUCCESS', workspace });
});

module.exports = {
  createWorkspace,
  retrieveWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
};
