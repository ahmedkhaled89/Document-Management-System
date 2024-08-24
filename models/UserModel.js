const mongoose = require('mongoose');
const Document = require('./DocumentModel');
const Workspace = require('./WorkspaceModel');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nationalID: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  Workspaces: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
    },
  ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
