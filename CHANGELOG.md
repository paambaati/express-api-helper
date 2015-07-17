# Change Log

## 0.0.5 (2015-07-17)

 * Add support for `403` Fobidden response.
 * Update testcases with Express 4.x changes (body-parser).
 * Bump dependencies - express 3.4.8 → 4.13.1, mocha 1.17.1 → 2.2.5, supertest 0.9.0 → 1.0.1.
 * Add Travis builds for Node 0.12 and iojs.

## 0.0.4 (2014-12-24)

 * Fix deprecation warnings thrown by Express 4.
 * Add requireHeaders() method to support checking for headers.

## 0.0.3 (2014-03-08)

  * When testing for required params in `requireParams()`, use `hasOwnProperty()` and check for params in `req.params` in addition to `req.body` and `req.query`

## 0.0.2 (2014-03-06)

  * Fix bug in `requireParams()` (Issue #1)
  * Upgrade dependency versions

## 0.0.1 (2013-03-10)

  * First version
