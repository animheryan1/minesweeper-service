const express = require('express');

const router = express.Router();
const asyncHandler = require('express-async-handler');
const authService = require('../auth/auth.service');
const users = require('./users.service');

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { body } = req;
    const result = await users.create(body);

    const { username, password } = body;
    const token = await authService.login(username, password);

    const response = { ...result._doc, token };
    res.status(201).json(response);
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await users.findAll(req.query);
    res.json(result);
  })
);

router.get(
  '/me',
  asyncHandler(async (req, res) => {
    const result = await users.findOne(req.user.userId);
    res.json(result);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await users.findOne(id);
    res.json(result);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await users.update(id, req.body);
    res.json(result);
  })
);

module.exports = router;
