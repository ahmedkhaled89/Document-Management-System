const express = require('express');
const UserController = require('../controllers/UserController');
const { checkSchema } = require('express-validator');

const UserRouter = express.Router();

UserRouter.post(
  '/api/users/register',
  checkSchema(
    {
      email: { isEmail: true },
      nationalID: { notEmpty: true },
      firstName: { notEmpty: true },
      lastName: { notEmpty: true },
      password: { notEmpty: true, isLength: { options: { min: 8 } } },
    },
    ['body']
  ),
  UserController.register
);
UserRouter.post('/api/users/login', UserController.login);

module.exports = UserRouter;
