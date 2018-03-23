const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Review = require('../models/review');
import {authorizeUser} from "../middleware/index";
import Utils from '../utils';

/*
GET routes
 */

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
	Course
		.findById(req.params.courseId)
		.populate('user')
		.populate({path: 'reviews',
		 populate: {path: 'user'}})
		.exec((err, course) => {
			Utils.isError(err, next);
			res.locals.course = course;
			let status = 200;
			return res.status(status).json({success: true, message: "Course Successfully retrieved!", status: status, course: res.locals.course });
		});
});

/*
PUT Routes
 */
router.put('/:courseId', authorizeUser, (req, res, next) => {
	Course.findByIdAndUpdate(req.params.courseId, req.body, (err, course) => {
		Utils.isError(err, next);
		let status = 204;
		return res.status(status).json({}); //Send status 204 and no content..
	});
});

/*
POST Routes
 */
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

router.post('/:courseId/reviews', authorizeUser, (req, res, next) => {
	let review = new Review(req.body);
	review.save((err) => {
		Utils.isError(err, next);
		Course.findById(req.params.courseId, (err, course) => {
			Utils.isError(err, next);
			course.reviews.push(review._id);
			course.save((err) => {
				Utils.isError(err, next);
				let status = 201;
				res.location('/api/courses/'+req.params.courseId);
				return res.status(status).json({success: true, message: "Review Successfully added to Course!", status: status, course});
			});
		});
	});
});
module.exports = router;