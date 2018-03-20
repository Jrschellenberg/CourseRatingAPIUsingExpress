//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const User = require('../src/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();

const postAPI = '/user';


describe('Users', () => {
	beforeEach((done) => {
		User.remove({}, (err) => {
			done();
		});
	});
	
	
	describe('/POST user', () => {
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
						err.message.should.be.equal('test');
						res.should.have.status(500);
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
		function postUser(user, done){
			chai.request(server)
				.post(postAPI)
				.send(user)
				.end((err, res) => {
					res.should.have.status(422);
					done();
				});
		}
		function postUser400(user, done ) {
			chai.request(server)
				.post(postAPI)
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('message').equal("Malformed Email Supplied");
					done();
				});
		}
	});
});