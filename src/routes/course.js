const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Review = require('../models/review');

import { authorizeUser } from '../middleware/index';
import Utils from '../utils';

/*
GET routes
 */

router.get('/', (req, res, next) => {
  Course.find({}, (err, courses) => {
    if (err) { return next(err) }
    let coursesArray = [];

    for (let i = 0; i < courses.length; i++) {
      let obj = {
        _id: courses[i]._id,
        title: courses[i].title
      };

      coursesArray.push(obj);
    }
    let status = 200;

    return res.status(status).json({ success: true, message: 'Courses Successfully retrieved!', status: status, courses: coursesArray });
  });
});

router.get('/:courseId', (req, res, next) => {
  Course
		.findById(req.params.courseId)
		.populate('user')
		.populate({
  path: 'reviews',
		 populate: { path: 'user' }
})
		.exec((err, course) => {
  if (err) { return Utils.propagateError(err, 400, next) }
  res.locals.course = course;
  let status = 200;

  return res.status(status).json({ success: true, message: 'Course Successfully retrieved!', status: status, course: res.locals.course });
});
});

/*
PUT Routes
 */
router.put('/:courseId', authorizeUser, (req, res, next) => {
  Course.findByIdAndUpdate(req.params.courseId, req.body, (err, course) => {
    if (err) { return Utils.propagateError(err, 400, next) }
    let status = 204;

    return res.status(status).json({}); // Send status 204 and no content..
  });
});

/*
POST Routes
 */
router.post('/', authorizeUser, (req, res, next) => {
  if (!req.body.title || !req.body.description) {
    return Utils.throwError(400, 'Bad Request', next);
  }
  const courseData = req.body;

  Course.create(courseData, (err, course) => {
    if (err) { return Utils.propagateError(err, 400, next) }
    let status = 201;

    return res.status(status).json({ success: true, message: 'Course Successfully added!', status: status, course });
  });
});

router.post('/:courseId/reviews', authorizeUser, (req, res, next) => {
  let review = new Review(req.body);

  review.save((err) => {
    if (err) { return Utils.propagateError(err, 400, next) }
    Course.findById(req.params.courseId, (err, course) => {
      if (err) { return Utils.propagateError(err, 400, next) }
      course.reviews.push(review._id);
      course.save((err) => {
        if (err) { return Utils.propagateError(err, 400, next) }
        let status = 201;

        res.location('/api/courses/' + req.params.courseId);

        return res.status(status).json({});  // Supposed to return no content. therefore no json.
      });
    });
  });
});


module.exports = router;
