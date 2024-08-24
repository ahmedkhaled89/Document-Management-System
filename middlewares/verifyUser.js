const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers['Authorization'] || req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  try {
    const userCredentials = jwt.verify(token, process.env.SECRET_KEY);
    req.userCredentials = userCredentials;
    next();
  } catch (err) {
    return next(new Error('Not authenticated'));
  }
};

module.exports = verifyToken;
