const fs = require('fs').promises;

const convertToBase64 = async (docPath) => {
  const encodedDoc = await fs.readFile(docPath, { encoding: 'base64' });
  return encodedDoc;
};

module.exports = { convertToBase64 };
