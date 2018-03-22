const express = require('express');
const router = express.Router();
const Course = require('../models/course');
import {authorizeUser} from "../middleware/index";
import Utils from '../utils';

router.get('/', (req, res, next) => {
	Course.find({}, (err, courses) => {
		if(err){
			return next(err);
		}
		let coursesArray = [];
		for(let i=0; i<courses.length; i++){
			let obj = {
				_id: courses[i]._id,
				title: courses[i].title
			};
			coursesArray.push(obj);
		}
		let status = 200;
		return res.status(status).json({success: true, message: "Courses Successfully retrieved!", status: status, courses: coursesArray});
	});
});

router.get('/:courseId', (req, res, next) => {
	Course.findById(req.params.courseId, (err, course) => {
		Utils.isError(err, next);
		course.getUser((err1, user) => {
			Utils.isError(err1, next);
			course.user = user;
			let itemsProcessed = 0;
			course.reviews.forEach((courseReview, index, array) => {
				course.getReview(index, (err2, review) => {
					Utils.isError(err2, next);
					review.getUser((err3, reviewUser) => {
						Utils.isError(err3, next);
						review.user = reviewUser;
						course.reviews[index] = review;
						itemsProcessed++;
						if(itemsProcessed === array.length){
							res.locals.course = course;
							next();
						}
					});
				});
			});
		});
	});
}, (req, res) => {
	let status = 200;
	return res.status(status).json({success: true, message: "Course Successfully retrieved!", status: status, course: res.locals.course });
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