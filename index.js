'use strict';
var msb = require('msb');
var debug = require('debug')('msb:newrelic');

if (process.env.NEW_RELIC_LICENSE_KEY) {
  msb.plugins = msb.plugins || {};

  if (!process.env.NEW_RELIC_HOME) process.env.NEW_RELIC_HOME = __dirname;
  if (process.env.NEW_RELIC_HOME === __dirname && !process.env.NEW_RELIC_APP_NAME) {
    process.env.NEW_RELIC_APP_NAME = msb.serviceDetails.name;
  }
  var newrelic = msb.plugins.newrelic = msb.plugins.newrelic || require('newrelic');

  msb.plugins.http2busMiddleware = function(route) {
    return function(req, res, next) {
      newrelic.setTransactionName(route.http.path);
      next();
    };
  };

  process.once('uncaughtException', function(err) {
    debug(err);
    newrelic.addCustomParameter('crash', 'true');
    newrelic.noticeError(err);
    newrelic.agent.harvest(function() {
      setTimeout(function() {
        process.exit(1);
      }, 1000);
    });
  });

  debug('loaded', newrelic.agent.config.app_name);
}
module.exports = msb;
