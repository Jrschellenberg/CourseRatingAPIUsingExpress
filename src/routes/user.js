const express = require('express');
const router = express.Router();
const User = require('../models/user');

import { authorizeUser } from '../middleware/index';
import Utils from '../utils';

/* GET Routes */
router.get('/', authorizeUser, (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return Utils.throwError(401, 'Invalid or missing SessionId', next);
  }
  User.findById(req.session.userId)
		.exec((err, user) => {
  if (err) { return Utils.propagateError(err, 400, next) }
  let status = 200;

  res.status(status).json({ success: true, message: 'User Successfully retrieved', status: status, user: user });
});
});

/*
Post Routes
 */
router.post('/', (req, res, next) => {
  if (!req.body.emailAddress || !req.body.fullName || !req.body.password) {
    return Utils.throwError(422, 'Missing Parameters', next);
  }
  if (!User.validEmail(req.body.emailAddress)) {
    return Utils.throwError(400, 'Malformed Email Supplied', next);
  }
  User.userExist(req.body.emailAddress, (err) => {
    if (err) { return Utils.propagateError(err, 409, next) }
    const userData = req.body;

    User.create(userData, (err, user) => {
      if (err) { return Utils.propagateError(err, 400, next) }
      res.location('/');

      return res.status(201).json({ success: true, message: 'User Successfully added!', status: 201, user });
    });
  });
});


module.exports = router;
