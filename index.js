var msb = require('msb');
msb.plugins = msb.plugins || {};

if (!process.env.NEW_RELIC_HOME) process.env.NEW_RELIC_HOME = __dirname;
var newrelic = msb.plugins.newrelic = require('newrelic');

msb.plugins.http2busMiddleware = function(route) {
  return function(req, res, next) {
    newrelic.setTransactionName(route.http.path);
    next();
  };
};

module.exports = msb;
