const User = require('../models/UserModel');
const jwtGenerator = require('../utils/jwtGenerator');
const hash = require('../utils/hash');
const errorCatchingWrapper = require('../middlewares/errorCatchingWrapper');
const comparePassword = require('../utils/comparePassword');
const { validationResult } = require('express-validator');

const register = errorCatchingWrapper(async (req, res, next) => {
  const { firstName, lastName, nationalID, password, email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
  res.status(201).json({ token: user.token });
});

const login = errorCatchingWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error('No Such User'));
  const match = await comparePassword(password, user.password);
  if (!match) {
    return next(new Error('invalid Password'));
  }
  user.token = jwtGenerator({ _id: user._id, email }, process.env.SECRET_KEY);
  res.json({ token: user.token });
});
module.exports = { register, login };
