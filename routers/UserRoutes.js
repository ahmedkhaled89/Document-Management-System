const express = require('express');
const UserController = require('../controllers/UserController');

const UserRouter = express.Router();

UserRouter.post('/api/users/register', UserController.register);

module.exports = UserRouter;
