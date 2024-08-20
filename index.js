require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_URL_LOCAL = process.env.MONGODB_URL_LOCAL;

mongoose
  .connect(MONGODB_URL_LOCAL)
  .then(() => console.log('Connected to mongoDB'))
  .catch((error) => console.log(error.message));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listing on port ${port}`);
});
