var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000');


describe('User', function () {

	before(function (done) {
		api.post('/locations')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({
				addressStreet: '111 Main St',
				addressCity: 'Portland',
				addressState: 'OR',
				addressZip: '97209',
				userId: 1
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function (err, res) {
				location1 = res.body;
			});
	});


	it('should return a 200 response', function (done) {

		api.get('/users/1')
			.set('Accept', 'application/json')
			.expect(200, done);
	});


	it('should be an object with keys and value', function (done) {
		api.get('/users/1')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (err, res) {
				expect(res.body).to.have.property('name');
				expect(res.body.name).to.be.not.equal(null);
				expect(res.body).to.have.property('email');
				expect(res.body.email).to.be.not.equal(null);
				expect(res.body).to.have.property('phoneNumber');
				expect(res.body.phoneNumber).to.be.not.equal(null);
				expect(res.body).to.have.property('role');
				expect(res.body.role).to.be.not.equal(null);
				done();
			});
	});

	it('should be updated with a new name', function (done) {
		api.put('/users/1')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({
				name: 'Kevin',
				email: 'kevin@example.com',
				phoneNumber: '9998887777',
				role: 'editor'
			})
			.expect(200)
			.end(function (err, res) {
				expect(res.body.name).to.equal('Kevin');
				expect(res.body.email).to.equal('kevin@example.com');
				expect(res.body.phoneNumber).to.equal('9998887777');
				expect(res.body.role).to.equal('editor');
				done();
			});
	});

	it('should not be able to access other users location', function (done) {
		api.get('/users/2/location')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({
				userId: 1
			})
			.expect(401)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.error.text).to.equal('Unauthorized');
				done();
			});
	});


	it('should access their own location', function (done) {
		api.get('/users/1/location')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({
				userId: 1
			})
			.expect(200)
			.end(function (err, res) {
				expect(res.body.userId).to.equal(1);
				expect(res.body.addressCity).to.equal('Portland');
				done();
			});
	});
});