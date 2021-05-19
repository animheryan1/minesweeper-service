const { Forbidden } = require('http-errors');
const { validateToken } = require('../../auth/auth.service');

const jwtMiddleware = async (req, res, next) => {
  let token;
  try {
    token = req.header('authorization').split(' ')[1];
    req.user = validateToken(token);
  } catch (err) {
    return next(new Forbidden(err.message));
  }
  next();
};

jwtMiddleware.unless = require('express-unless');

module.exports = {
  jwtMiddleware,
};
