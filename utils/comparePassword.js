const bcrypt = require('bcryptjs');

const comparePassword = async (password, hashedPassword) =>
  await bcrypt.compare(password, hashedPassword);

module.exports = comparePassword;
