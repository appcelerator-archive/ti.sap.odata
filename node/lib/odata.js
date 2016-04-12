/*!
 * Odata
 * Odata module for Node.js, Titanium and Web.
 */

var request = require('superagent');

// content types

var TYPES = {
  xml : 'application/xml',
  json : 'application/json',
  txt : 'plain/text'
};

// expose OData

module.exports = OData;

/**
 * [OData description]
 * @param {[type]} url      [description]
 * @param {[type]} path [description]
 */

function OData(url, path, opts) {
  if (!(this instanceof OData)) return new OData(url, path, opts);
  if ('string' !==  typeof path) {
    opts = path;
    path = '';
  }
  opts = opts || {};

  this.base = url;
  this.path = path;
  this.user = opts.user || null;
  this.password = opts.password || null;
}

/**
 * [resource description]
 * @param  {[type]} resource [description]
 * @return {[type]}          [description]
 */

OData.prototype.resource = function(path) {
  return new OData(this.base, path);
};

/**
 * [_request description]
 * @param  {[type]} method [description]
 * @param  {[type]} opts   [description]
 * @return {[type]}        [description]
 */

OData.prototype._request = function(method, opts) {
  var base = opts.base || this.base
    , resource = opts.resource || this.path || ''
    , format = opts.format
    , user = opts.user || this.user
    , password = opts.password || this.password;

  var req = request[method](base + '/' + resource)
  req.buffer && req.buffer(true);

  if (opts.accept) { req.set('Accept', TYPES[opts.accept] || opts.accept); }
  if (format) { req.query({ '$format' : format }); }
  if (this.cookie) { req.set({'Cookie': this.cookie}); }
  if (user && password && !this.cookie) { req.auth(user,password); }

  return req;

};

/**
 * [get description]
 * @param  {[type]}   opts [description]
 * @param  {Function} fn   [description]
 * @return {[type]}        [description]
 */

OData.prototype.get = function(opts, fn) {
  var self = this;

  // create get request

  var req = this._request('get', opts);

  req.query(opts.query || {});

  // return request object if no callback provided

  if (!fn) { return req; }

  req.end(function(err, res) {
    if (res.headers['set-cookie'] && !self.cookie) { self.cookie = res.headers['set-cookie']; }
    if (!res.ok) err = res.text;
    fn(err, res);
  });

  return this;
};

/**
 * [get description]
 * @param  {[type]}   opts [description]
 * @param  {Function} fn   [description]
 * @return {[type]}        [description]
 */

OData.prototype.add = function(opts, fn) {
  var self = this;

  // create get request

  var req = this._request('post', opts);

  req.query(query)
  req.send(opts.data);
  // return request object if no callback provided

  if (!fn) { return req; }

  req.end(function(err, res) {
    if (res.headers['set-cookie'] && !self.cookie) { self.cookie = res.headers['set-cookie']; }
    if (!res.ok) err = res.text;
    fn(err, res);
  });

  return this;
};

/**
 * [get description]
 * @param  {[type]}   opts [description]
 * @param  {Function} fn   [description]
 * @return {[type]}        [description]
 */

OData.prototype.update = function(opts, fn) {
  var self = this;

  // create get request

  var req = this._request('put', opts);

  req.query(query)
  req.send(opts);

  // return request object if no callback provided

  if (!fn) { return req; }

  req.end(function(err, res) {
    if (res.headers['set-cookie'] && !self.cookie) { self.cookie = res.headers['set-cookie']; }
    if (!res.ok) err = res.text;
    fn(err, res);
  });

  return this;
};

/**
 * [get description]
 * @param  {[type]}   opts [description]
 * @param  {Function} fn   [description]
 * @return {[type]}        [description]
 */

OData.prototype.rm
OData.prototype.remove = function(opts, fn) {
  var self = this;

  // create get request

  var req = this._request('del', opts);

  req.query(query)

  // return request object if no callback provided

  if (!fn) { return req; }

  req.end(function(err, res) {
    if (res.headers['set-cookie'] && !self.cookie) { self.cookie = res.headers['set-cookie']; }
    if (!res.ok) err = res.text;
    fn(err, res);
  });

  return this;
};

/**
 * [get description]
 * @param  {[type]}   opts [description]
 * @param  {Function} fn   [description]
 * @return {[type]}        [description]
 */

OData.prototype.metadata = function(opts, fn) {
  var self = this;
  opts = opts || {}
  opts.resource = '$metadata';

  var req = this._request('get', opts);

  // return request object if no callback provided

  if (!fn) { return req; }

  req.end(function(err, res) {
    if (res.headers['set-cookie'] && !self.cookie) { self.cookie = res.headers['set-cookie']; }
    if (!res.ok) err = res.text;
    fn(err, res);
  });

  return this;
};

Salesforce.model = require('./model');

if ('undefined' !== typeof Ti) { OData.init = require('./tishim'); }
