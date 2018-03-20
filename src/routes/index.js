const express = require('express');
const router = express.Router();
const Course = require('../models/course');

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


module.exports = router;
