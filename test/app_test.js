'use strict';
process.env.NODE_ENV = 'test';

const User = require('../src/models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;

const invalidURLPath = '/someInvalidPath/ThatIsInvalid';

describe('App', () => {
	describe('/GET', () => {
		it('should throw 404 error if /GET url specified is not found in Routes', (done) => {
			chai.request(server)
				.get(invalidURLPath)
				.end((err, res) => {
					handleEnd(404, "Not Found", false, err, res, done);
				});
		});
	});
	describe('/POST', () => {
		it('should throw 404 error if /POST url specified is not found in Routes', (done) => {
			chai.request(server)
				.post(invalidURLPath)
				.end((err, res) => {
					handleEnd(404, "Not Found", false, err, res, done);
				});
		});
	});
	function handleEnd(status, msg, success, err, res, done){
		res.should.have.status(status);
		res.body.should.have.property('success').equal(success);
		res.body.should.have.property('message').equal(msg);
		done();
	}
});