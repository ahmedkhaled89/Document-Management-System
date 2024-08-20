const User = require('../models/UserModel');
const jwtGenerator = require('../utils/jwtGenerator');
const hash = require('../utils/hash');

const register = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
};

module.exports = { register };
