require('dotenv').config({
  path: '.env',
});

require('./mongo');
const express = require('express');
const cors = require('cors');

const users = require('./users/users.controller');
const auth = require('./auth/auth.controller');

const {
  handleError,
} = require('./common/middlewares/error-handler.middleware');
const { jwtMiddleware } = require('./common/middlewares/auth.middleware');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(
  jwtMiddleware.unless({
    path: ['/auth/login', { url: '/users', methods: ['POST'] }],
  })
);

app.use('/users', users);
app.use('/auth', auth);
app.get('/', (req, res) => {
  res.status(200).send('Success');
});

app.use(handleError);
module.exports = app;
