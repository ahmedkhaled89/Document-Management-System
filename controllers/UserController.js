const User = require('../models/UserModel');
const jwtGenerator = require('../utils/jwtGenerator');
const hash = require('../utils/hash');
const errorCatchingWrapper = require('../middlewares/errorCatchingWrapper');
const comparePassword = require('../utils/comparePassword');
const { validationResult } = require('express-validator');

const register = errorCatchingWrapper(async (req, res, next) => {
  const { firstName, lastName, nationalID, password, email } = req.body;
  if (
    !firstName.trim() ||
    !lastName.trim() ||
    !nationalID.trim() ||
    !password.trim()
  ) {
    return res.status(400).json('All field are required');
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: 'FAIL', error: `invalid ${errors.array()[0].path}` });
  }
  const oldUser = await User.findOne({ $or: [{ email }, { nationalID }] });
  if (oldUser) {
    return res.status(400).json({
      status: 'FAIL',
      error: 'User with the same email or National Id already exist',
    });
  }
  const hashedPassword = await hash(password);
  const newUser = new User({
    firstName,
    lastName,
    nationalID,
    email,
    password: hashedPassword,
  });
  const token = jwtGenerator(
    { _id: newUser._id, email: email },
    process.env.SECRET_KEY
  );
  newUser.token = token;
  const user = await newUser.save();
  if (!user) return next(new Error('Fail to register user'));
  res.status(201).json({
    token,
    email,
    firstName,
    lastName,
    nationalID,
    _id: user._id,
  });
});

const login = errorCatchingWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ status: 'ERROR', error: 'No Such User' });
  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(400).json({ status: 'FAIL', error: 'invalid Password' });
  }
  user.token = jwtGenerator({ _id: user._id, email }, process.env.SECRET_KEY);
  res.status(200).json({
    email,
    firstName: user.firstName,
    lastName: user.lastName,
    nationalID: user.nationalID,
    token: user.token,
    _id: user._id,
  });
});
module.exports = { register, login };
