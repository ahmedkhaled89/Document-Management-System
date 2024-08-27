const express = require('express');
const verifyToken = require('../middlewares/verifyUser');
const DocController = require('../controllers/DocController');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname.replaceAll(' ', '-')}`;

    cb(null, fileName);
  },
});
const upload = multer({ storage });

const docRoute = express.Router();

docRoute
  .route('/api/docs/upload')
  .post(verifyToken, upload.single('doc'), DocController.uploadDoc);

docRoute.route('/api/docs/download/:docID').get(DocController.downloadDoc);

docRoute.route('/api/docs/preview/:docID').get(DocController.getDocAsBase64);

docRoute.route('/api/docs/:docID').get(DocController.getDoc);

docRoute.route('/api/docs/delete/:docID').delete(DocController.softDeleteDoc);
module.exports = docRoute;
