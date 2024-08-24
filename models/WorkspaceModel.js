const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const WorkspaceSchema = new Schema({
  name: { type: String, required: true },
  ownerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  DocumentsIDs: [
    {
      DocumentID: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
      },
    },
  ],
});

WorkspaceSchema.index({ ownerID: 1, name: 1 }, { unique: true });

const Workspace = mongoose.model('Workspace', WorkspaceSchema);
module.exports = Workspace;
