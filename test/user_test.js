//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const User = require('../src/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;

const postAPI = '/api/users';
const getAPI = postAPI;


describe('Users', () => {
	
	describe('/GET users', () => {
		it('should not GET if auth headers are missing', (done) => {
			chai.request(server)
				.get(getAPI)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('success').equal(false);
					res.body.should.have.property('message').equal("Access Denied: Please supply login credentials!");
					done();
				});
		});
		it('should not GET if auth headers supplied are invalid', (done) => {
			let auth = {
				user: 'user@notValidEmail.com',
				pass: 'notValidPass'
			};
			getAuthRequest(auth, 401, false, "Access Denied: Wrong email or password", done);
		});
		
		it('should GET if auth headers are present', (done) => {
			let user = {
				_id: "57029ed4795118be119cc437",
				fullName: "Joe Smith",
				emailAddress: "joe@smith.com",
				__v: 0
			};
			let auth = {
				user: 'joe@smith.com',
				pass: 'password'
			};
			getAuthRequest(auth, 200, true, "User Successfully retrieved", done, user);
		});
		
		function getAuthRequest(auth, status, success, msg, done, user) {
			chai.request(server)
				.get(getAPI)
				.auth(auth.user, auth.pass)
				.end((err, res) => {
					res.should.have.status(status);
					res.body.should.have.property('success').equal(success);
					res.body.should.have.property('message').equal(msg);
					if(user){
						res.body.should.have.property('user').property('fullName').equal(user.fullName);
						res.body.should.have.property('user').property('emailAddress').equal(user.emailAddress);
						res.body.should.have.property('user').property('_id').equal(user._id);
					}
					done();
				});
		}
	});
	
	describe('/POST users', () => {
		// beforeEach((done) => {
		// 	User.remove({}, (err) => {
		// 		done();
		// 	});
		// });
		let user400 = {
			emailAddress: 'wre23sd',
			password: 'password',
			fullName: 'jerry springer'
		};
		
		it('should not POST if email address supplied is invalid email address "wre23sd"', (done) => {
			user400.email = "wre23sd";
			postUser400(user400, done);
		});
		it('should not POST if email address supplied is invalid email address "garbage@moreGarbage."', (done) => {
			user400.email = "garbage@moreGarbage.";
			postUser400(user400, done);
		});
		it('should not POST if email address supplied is invalid email address ""test@owiejadskla""', (done) => {
			user400.email = "test@owiejadskla";
			postUser400(user400, done);
		});
		it('should not POST if email Address already exists in DB', (done) => {
			let user = {
				emailAddress: 'test@gmail.com',
				password: 'password',
				fullName: 'jerry springer'
			};
			chai.request(server)
				.post(postAPI)
				.send(user)
				.end((err, res) => {
					res.should.have.status(201);
					chai.request(server)
						.post(postAPI)
						.send(user)
						.end((err, res) => {
							res.body.should.have.property('message').equal("User Already Exists");
							res.should.have.status(409); //Conflict error
							done();
						});
				});
		});
		
		it('should not POST a user supplied with no data', (done) => {
			let user = {};
			postUser(user, done);
		});
		it('should not POST a user missing email address', (done) => {
			let user = {
				password: 'password',
				fullName: 'jerry springer'
			};
			postUser(user, done);
		});
		it('should not POST a user missing Full Name', (done) => {
			let user = {
				emailAddress: 'test@gmail.com',
				password: 'password'
			};
			postUser(user, done);
		});
		it('should not POST a user missing Password', (done) => {
			let user = {
				emailAddress: 'test@gmail.com',
				fullName: 'jerry springer'
			};
			postUser(user, done);
		});
		
		function postUser(user, done) {
			chai.request(server)
				.post(postAPI)
				.send(user)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('success').equal(false);
					done();
				});
		}
		
		function postUser400(user, done) {
			chai.request(server)
				.post(postAPI)
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('message').equal("Malformed Email Supplied");
					res.body.should.have.property('success').equal(false);
					done();
				});
		}
	});
});