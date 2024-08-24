const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
  name: { type: String, required: true, default: 'TEST Doc' },
  docType: { type: String, required: true, default: 'pdf' },
  ownerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workspaceID: {
    type: Schema.Types.ObjectId,
    ref: 'Workspace',
    default: '2222',
  },
});
const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;
