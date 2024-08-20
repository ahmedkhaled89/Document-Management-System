const jwt = require('jsonwebtoken');

const jwtGenerator = (payload, secretKey) => {
  return jwt.sign(payload, secretKey);
};

module.exports = jwtGenerator;
