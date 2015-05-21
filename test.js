var assert = require('assert');
var simple = require('simple-mock');
var msb = require('msb');

msb.plugins = msb.plugins || {};
var mockNewrelic = msb.plugins.newrelic = {
  agent: {
    config: {
      app_name: ['test']
    }
  }
};

simple.mock(mockNewrelic, 'addCustomParameter').returnWith();
simple.mock(mockNewrelic, 'noticeError').returnWith();
simple.mock(mockNewrelic.agent, 'harvest').callbackWith();
simple.mock(process, 'exit').returnWith();
simple.mock(process.env, 'NEW_RELIC_LICENSE_KEY', 'something');

var msb = require('./index');
var error = new Error('my uncaught exception');

setTimeout(function() {
  try {
    assert(mockNewrelic.addCustomParameter.called);
    assert(mockNewrelic.noticeError.called);
    assert.equal(mockNewrelic.noticeError.lastCall.arg, error);
    assert(process.exit.called);
  } catch (e) {
    return console.log(e.message, 'on line ' + e.stack.match(/\d+/)[0]);
  }
  console.log('passed');
}, 2000);

// Test code
throw error;
