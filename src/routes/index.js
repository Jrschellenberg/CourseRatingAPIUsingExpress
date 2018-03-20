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
	  //return res.json({body: req.body});
  }
  
  const courseData = {
  	user: req.body.user._id,
	  title: req.body.title,
	  description: req.body.description,
	  estimatedTime: req.body.estimatedTime,
	  materialsNeeded: req.body.materialsNeeded,
	  steps: req.body.steps,
	  reviews: req.body.reviews
  };
  console.log(courseData);
  Course.create(courseData, (err, course) => {
    if(err){
    	console.log("hitting error?");
      return next(err);
    }
    console.log("This shit ever get hit?");
    return res.json({message: "Course Successfully added!", course});
  });
});


router.post('/user', (req, res, next) => {
	console.log("hit the request...");
	const userData = req.body;
	User.create(userData, (err, user) => {
		console.log("got into the create method?!?!");
		if (err) {
			return next(err);
		}
		return res.json({message: "User Successfully added!", user});
	});
	
});

module.exports = router;
