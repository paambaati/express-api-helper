var request = require('supertest')
  , expect = require('expect.js')
  , express = require('express')
  , api = require('../');

process.env.NODE_ENV = 'test';

describe('the api', function () {
  it('should respond with 200 status for valid requests', function (done) {
    var app = express()
      , data = { message: 'ok' };

    app.get('/api/test', function (req, res) {
      api.ok(req, res, data);
    });

    request(app)
      .get('/api/test')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(JSON.stringify(data), done);
  });

  it('should respond with 400 status when POST request data is malformed', function (done) {
    var app = express()
      , expected = { message: 'Bad Request', errors: ['Missing required parameter: password'] };

    app.configure(function () {
      app.use(express.bodyParser());
    });
    app.post('/api/test', function (req, res) {
      api.requireParams(req, res, ['username', 'password'], function (err) {
        api.ok(req, res, { message: 'ok' });
      });
    });

    request(app)
      .post('/api/test')
      .send({ username: 'hercules' })
      .expect('Content-Type', /json/)
      .expect(400)
      .expect(JSON.stringify(expected), done);
  });

  it('should respond with 400 status when GET request data is malformed', function (done) {
    var app = express()
      , expected = { message: 'Bad Request', errors: ['Missing required parameter: password'] };

    app.get('/api/test', function (req, res) {
      api.requireParams(req, res, ['username', 'password'], function (err) {
        api.ok(req, res, { message: 'ok' });
      });
    });

    request(app)
      .get('/api/test?username=hercules')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect(JSON.stringify(expected), done);
  });

  it('should respond with 401 status when the client is unauthorized', function (done) {
    var app = express()
      , expected = { message: 'Unauthorized' };

    app.get('/api/test', function (req, res) {
      api.unauthorized(req, res);
    });

    request(app)
      .get('/api/test')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect(JSON.stringify(expected), done);
  });

  it('should respond with 404 status when the requested resource does not exist', function (done) {
    var app = express()
      , expected = { message: 'Not Found' };

    app.get('/api/test', function (req, res) {
      api.notFound(req, res);
    });

    request(app)
      .get('/api/test')
      .expect('Content-Type', /json/)
      .expect(404)
      .expect(JSON.stringify(expected), done);
  });

  it('should respond with 405 status when an unsupported API action is invoked', function (done) {
    var app = express()
      , expected = { message: 'Unsupported Action' };

    app.get('*', function (req, res) {
      api.unsupportedAction(req, res);
    });

    request(app)
      .get('/api/nonexistent')
      .expect('Content-Type', /json/)
      .expect(405)
      .expect(JSON.stringify(expected), done);
  });

  it('should respond with 422 status when validation fails', function (done) {
    var app = express()
      , expected = { message: 'Validation Failed', errors: ['Username is already taken.'] };

    app.configure(function () {
      app.use(express.bodyParser());
    });
    app.post('/api/test', function (req, res) {
      if (req.body.username === 'hercules')
        api.invalid(req, res, 'Username is already taken.');
    });

    request(app)
      .post('/api/test')
      .send({ username: 'hercules' })
      .expect('Content-Type', /json/)
      .expect(422)
      .expect(JSON.stringify(expected), done);
  });

  it('should respond with 500 status for internal server errors', function (done) {
    var app = express()
      , expected = {
          message: 'Internal Server Error',
          error: {
            message: 'Database error',
            stacktrace: '...'
          }
        };

    app.get('/api/test', function (req, res) {
      var err = new Error('Database error');
      err.stack = '...';
      api.serverError(req, res, err);
    });

    request(app)
      .get('/api/test')
      .expect('Content-Type', /json/)
      .expect(500)
      .expect(JSON.stringify(expected), done);
  });
});