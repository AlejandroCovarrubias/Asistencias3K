var request = require('supertest');
var app = require('../server.js');
describe('GET /', function() {
	it('displays "Hello World!"', function(done) {
		// This line below is the core test of out app.
		request(app).get('/').expect('Hello World!', done);
	});
});