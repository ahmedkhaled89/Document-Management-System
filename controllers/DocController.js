const errorCatchingWrapper = require('../middlewares/errorCatchingWrapper');
const Doc = require('../models/DocumentModel');
const User = require('../models/UserModel');
const Workspace = require('../models/WorkspaceModel');
const fs = require('fs').promises;

const uploadDoc = errorCatchingWrapper(async (req, res, next) => {
  const workspace = await Workspace.findById(req.body.workspaceID);
  const owner = await User.findById(req.userCredentials._id);
  if (!owner || !workspace || !req.file) {
    return res
      .status(400)
      .json({ status: 'FAIL', error: 'All fields are required' });
  }

  const newDoc = new Doc({ ownerID: owner._id, workspaceID: workspace._id });
  newDoc.docName = req.file.filename;
  newDoc.docType = req.file.mimetype;
  newDoc.destination = req.file.path;
  newDoc.docPath = req.file.path;
  newDoc.extension = req.file.extension;
  const createdDoc = await newDoc.save();
  owner.docsIDs.push(createdDoc._id);
  await owner.save();
  workspace.DocsIDs.push(createdDoc._id);
  await workspace.save();
  res.status(201).json({ status: 'uploaded SUCCESSFULLY', createdDoc });
});

const downloadDoc = errorCatchingWrapper(async (req, res, next) => {
  const docID = req.params.docID;
  const doc = await Doc.findById(docID);
  if (!doc || doc.deleted) {
    return res.status(404).json({ message: 'this document does NOT exist' });
  }
  res.status(200).download(doc.destination, doc.docName);
});

const softDeleteDoc = errorCatchingWrapper(async (req, res, next) => {
  const docID = req.params.docID;
  const updatedDoc = await Doc.findByIdAndUpdate(
    docID,
    { $set: { deleted: true } },
    { new: true }
  );
  if (!updateDoc) {
    return res
      .status(404)
      .json({ status: 'FAIL', error: 'this doc does not exist' });
  }
  res.status(200).json({ status: 'Document Deleted Successfully', updatedDoc });
});

const getDocAsBase64 = errorCatchingWrapper(async (req, res, next) => {
  const docID = req.params.docID;
  const doc = await Doc.findById(docID);
  if (!doc || doc.deleted) {
    return res.status(404).json({ message: 'this document does not exist' });
  }
  const docPath = doc.docPath;
  const encodedDoc = await fs.readFile(docPath, { encoding: 'base64' });

  res.json({
    base64String: encodedDoc,
    extension: doc.extension,
    type: doc.docType,
  });
});

const getDoc = errorCatchingWrapper(async (req, res, next) => {
  const docID = req.params.docID;
  const doc = await Doc.findById(docID);
  if (!doc || doc.deleted) {
    return res.status(404).json({ message: 'this document does not exist' });
  }
  res.json({ doc });
});

const updateDoc = errorCatchingWrapper(async (req, res, next) => {
  const docID = req.params.docID;

  const workspace = await Workspace.findById(req.body.workspaceID);
  const owner = await User.findById(req.userCredentials._id);
  if (!owner || !workspace || !req.file) {
    return res
      .status(400)
      .json({ status: 'FAIL', error: 'All fields are required' });
  }

  const doc = await Doc.findByIdAndUpdate(
    docID,
    {
      docName: req.file.filename,
      docType: req.file.mimetype,
      destination: req.file.path,
      docPath: req.file.path,
      extension: req.file.extension,
    },
    { new: true }
  );
  res.json({ updatedDoc: doc });
});

const searchDoc = errorCatchingWrapper(async (req, res, next) => {
  const q = req.query.q;
  const queries = q.split(' ');

  const regexConditions = queries.map((q) => ({
    $or: [
      { docName: { $regex: q, $options: 'i' } },
      { docType: { $regex: q, $options: 'i' } },
    ],
  }));
  const result = await Doc.find({
    $or: regexConditions,
    deleted: false,
  }).populate('workspaceID', 'name');
  res.json({ result });
});

module.exports = {
  uploadDoc,
  downloadDoc,
  softDeleteDoc,
  getDocAsBase64,
  getDoc,
  updateDoc,
  searchDoc,
};
