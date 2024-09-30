const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocSchema = new Schema(
  {
    docName: { type: String, required: true, default: 'TEST Doc', index: true },
    docType: { type: String, required: true, default: 'pdf' },
    ownerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    workspaceID: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
    },
    docPath: { type: String },
    originalname: { type: String },
    deleted: { type: Boolean, default: false },
    extension: { type: String, required: true },
  },
  { timestamps: true }
);

const Doc = mongoose.model('Doc', DocSchema);
module.exports = Doc;
