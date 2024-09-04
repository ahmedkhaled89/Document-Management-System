require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const UserRouter = require('./routers/UserRoutes');
const workspaceRouter = require('./routers/WorkspaceRoutes');
const docRoute = require('./routers/docRoutes');
const verifyToken = require('./middlewares/verifyUser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  '/uploads',
  verifyToken,
  express.static(path.join(__dirname, 'uploads'))
);
app.use(UserRouter);
app.use(workspaceRouter);
app.use(docRoute);

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_URL_LOCAL = process.env.MONGODB_URL_LOCAL;

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('Connected to mongoDB'))
  .catch((error) => console.log(error.message));

const port = process.env.PORT || 4000;

app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({ status: 'ERROR', message: error.message });
});

app.listen(port, () => {
  console.log(`listing on port ${port}`);
});
