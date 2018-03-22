'use strict';
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const Course = require('../src/models/course'),
	 chai = require('chai'),
	 chaiHttp = require('chai-http'),
	 server = require('../src/app');


const should = chai.should();
const courseIndexLink = '/api/courses/';
chai.use(chaiHttp);

const validAuth = {
	user: 'joe@smith.com',
	pass: 'password'
};

describe('Courses', () => {
	beforeEach((done) => {
		Course.remove({}, (err) => {
			done();
		});
	});
	
	/*
	Our GET Tests
	 */
	
	describe('/GET course', () => {
		it('should GET all the courses', (done) => {
			chai.request(server)
				.get(courseIndexLink)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
			
		});
	});
	
	describe('/POST course', () => {
		it('should POST a course with proper fields and proper auth', (done) => {
			let course = {
				title: "My first title!",
				description: "My course description",
				user: {
					_id: "57029ed4795118be119cc437"
				},
				steps: [
					{
						title: "step 1",
						description: "My first Step"
					}
				]
			};
			chai.request(server)
				.post(courseIndexLink)
				.auth(validAuth.user, validAuth.pass)
				.send(course)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.course.should.have.property('title');
					done();
				});
		});
		
		
		it('should not POST a course with no fields', (done) => {
			let course = {};
			postCourse(course, done);
		});
		
		it('should not POST a course missing title field', (done) => {
			let course = {
				description: "My course description",
				user: {
					_id: "57029ed4795118be119cc437"
				},
				steps: [
					{
						title: "step 1",
						description: "My first Step"
					}
				]
			};
			postCourse(course, done);
		});
		
		it('should not POST a course missing description field', (done) => {
			let course = {
				title: "my title",
				user: {
					_id: "57029ed4795118be119cc437"
				},
				steps: [
					{
						title: "step 1",
						description: "My first Step"
					}
				]
			};
			postCourse(course, done);
		});
		function postCourse(course, done){
			chai.request(server)
				.post(courseIndexLink)
				.auth(validAuth.user, validAuth.pass)
				.send(course)
				.end((err, res) => {
					//res.body.should.have.property('message').equal("test message");
					res.should.have.status(400);
					done();
				});
		}
	});
	
	
});