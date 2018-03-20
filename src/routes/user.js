const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.send('test');
});


router.post('/', (req, res, next) => {
	if(!req.body.emailAddress || !req.body.fullName || !req.body.password){
		const err = new Error("Missing Parameters");
		err.status = 422;
		return next(err);
	}
	if(!User.validEmail(req.body.emailAddress)){
		const err = new Error("Malformed Email Supplied");
		err.status = 400;
		return next(err);
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
			return res.status(201).json({message: "User Successfully added!", status: 201, user});
		});
	});
});



module.exports = router;