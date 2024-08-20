const bcrypt = require('bcryptjs');

const hash = async (str, salt = 8) => await bcrypt.hash(str, salt);

module.exports = hash;
