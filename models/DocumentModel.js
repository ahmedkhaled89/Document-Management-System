const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocSchema = new Schema({
  docName: { type: String, required: true, default: 'TEST Doc' },
  docType: { type: String, required: true, default: 'pdf' },
  ownerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  workspaceID: {
    type: Schema.Types.ObjectId,
    ref: 'Workspace',
  },
  docPath: { type: String },
  originalname: { type: String },
});
const Doc = mongoose.model('Doc', DocSchema);
module.exports = Doc;
