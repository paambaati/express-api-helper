# express-api-helper

Simple API helper module for Express apps.

## API

### `ok(req, res, data)`

Respond with `200 OK` and JSON-encoded data.

* `req` express Request
* `res` express Response
* `data` Object

### `badRequest(req, res, errors)`

Respond with `400 Bad Request` and JSON-encoded error object, `{message:String,errors:Array}`.

* `req` express Request
* `res` express Response
* `data` Array (of String) or String

### `unauthorized(req, res)`

Respond with `401 Unauthorized` and JSON-encoded error object, `{message:String}`.

* `req` express Request
* `res` express Response

### `notFound(req, res)`

Respond with `404 Not Found` and JSON-encoded error object, `{message:String}`.

* `req` express Request
* `res` express Response

### `unsupportedAction(req, res)`

Respond with `405 Method Not Allowed` and JSON-encoded error object, `{message:String}`.

* `req` express Request
* `res` express Response

### `invalid(req, res, errors)`

Respond with `422 Unprocessable Entity` and JSON-encoded error object, `{message:String,errors:Array}`.

* `req` express Request
* `res` express Response
* `errors` Array (of String) or String

### `serverError(req, res, error)`

Respond with `500 Internal Server Error` and JSON-encoded error object, `{message:String,error:Object}`.

* `req` express Request
* `res` express Response
* `error` Object

### `requireParams(req, res, params, callback)`

Require that listed parameters are present. Checks for presence of each parameter in `req.body` object if using `express.bodyParser` middleware; otherwise checks for presence of each parameter in `req.query`. If any parameters are missing, invokes `badRequest` with an array of error messages with the form `"Missing required parameter: %s"`.

* `req` express Request
* `res` express Response
* `params` Array (of String) or String
* `callback(err)` Function

## Example

Sample usage:

```javascript
var http = require('http')
  , express = require('express')
  , api = require('express-api-helper')
  , app = express()
  , Post = require('./models/post');

app.configure(function () {
  app.use(express.bodyParser());
  app.use(app.router);
});

app.all('/api/*', function (req, res, next) {
  if (!req.user) return api.unauthorized(req, res);
  next();
});

app.post('/api/posts', function (req, res) {
  api.requireParams(req, res, ['title', 'content', 'authorId'], function (err) {
    if (err) return api.serverError(req, res, err);
    var payload = {
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId
    };
    Post.create(payload, function (err, post) {
      if (err) return api.serverError(req, res, err);
      api.ok(req, res, post.toJSON());
    });
  });
});

app.get('/api/posts', function (req, res) {
  Post.find({}, function (err, posts) {
    if (err) return api.serverError(req, res, err);
    api.ok(req, res, posts.toJSON());
  });
});

app.get('/api/posts/:id', function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) return api.serverError(req, res, err);
    if (!post) return api.notFound(req, res);
    api.ok(req, res, post.toJSON());
  })
});

http.createServer(app).listen(3000, function () {
  console.log("Express API listening on 3000");
});
```

## Running Tests

To run the tests, clone the repository and install the dev dependencies:

```bash
git clone git://github.com/bryandragon/express-api-helper.git
cd express-api && npm install
make test
```

## License

Copyright (c) 2013 Bryan Dragon

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.