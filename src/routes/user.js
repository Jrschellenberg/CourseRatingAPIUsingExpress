const express = require('express');
const router = express.Router();
const User = require('../models/user');
import {authorizeUser} from "../middleware/index";
import Utils from '../utils';

/* GET home page. */
router.get('/', authorizeUser, (req, res) => {
	// if(!req.session || !req.session.userId){
	// 	Utils.throwError()
	// }
	// User.findById(req.session.userId)
	let status = 200;
	res.status(status).json({success: true, message: "User Successfully retrieved", status: status});
});


router.post('/', (req, res, next) => {
	if(!req.body.emailAddress || !req.body.fullName || !req.body.password){
		return Utils.throwError(422, "Missing Parameters", next);
	}
	if(!User.validEmail(req.body.emailAddress)){
		return Utils.throwError(400, "Malformed Email Supplied", next);
	}
	User.userExist(req.body.emailAddress, (err) => {
		if(err){
			return next(err);
		}
		const userData = req.body;
		User.create(userData, (err, user) => {
			if (err) {
				return next(err);
			}
			res.location('/');
			return res.status(201).json({success: true, message: "User Successfully added!", status: 201, user});
		});
	});
});



module.exports = router;