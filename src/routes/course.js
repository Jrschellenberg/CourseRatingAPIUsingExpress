const express = require('express');
const router = express.Router();
const Course = require('../models/course');
import {authorizeUser} from "../middleware/index";
import Utils from '../utils';

router.get('/',authorizeUser, (req, res, next) => {
	let status = 200;
	return res.status(status).json({success: true, message: "Courses Successfully retrieved!", status: status});
});

router.post('/', authorizeUser, (req, res, next) => {
	if(!req.body.title || !req.body.description){
		return Utils.throwError(400, "Bad Request", next );
	}
	const courseData = req.body;
	Course.create(courseData, (err, course) => {
		if(err){
			return next(err);
		}
		let status = 201;
		return res.status(status).json({success: true, message: "Course Successfully added!", status: status, course});
	});
});


module.exports = router;