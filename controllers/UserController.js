const User = require('../models/UserModel');
const jwtGenerator = require('../utils/jwtGenerator');
const hash = require('../utils/hash');
const errorCatchingWrapper = require('../models/errorCatchingWrapper');

const register = errorCatchingWrapper(async (req, res, next) => {
  const { password, email } = req.body;
  const hashedPassword = await hash(password);

  const newUser = new User({ ...req.body, password: hashedPassword });

  const token = jwtGenerator(
    { _id: newUser._id, email: email },
    process.env.SECRET_KEY
  );
  newUser.token = token;

  await newUser.save();

  res.status(201).json(newUser);
});

module.exports = { register };
