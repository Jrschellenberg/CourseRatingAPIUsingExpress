const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/course', function(req, res, next) {
	res.send("hello!");
});


router.post('/course', (req, res, next) => {
  if(!req.body.title || !req.body.description){
	  const err = new Error("Bad Request");
	  err.status = 400;
	  return next(err);
  }
  const courseData = req.body;
  Course.create(courseData, (err, course) => {
    if(err){ 
    	return next(err);
    }
	  return res.status(201).json({message: "User Successfully added!", status: 201, course});
  });
});

router.post('/user', (req, res, next) => {
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
