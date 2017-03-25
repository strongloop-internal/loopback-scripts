var _ = require('lodash');
var async = require('async');

exports.schedule = schedule;

// github search api allows 30 requests per minute
// https://developer.github.com/v3/search/#rate-limit
var REQUESTS = 30;
var INTERVAL = 61000;

var count = 0;
function schedule(opts, cb) {
  var q = async.queue(opts.job);

  var batches = _.chunk(opts.inputs, opts.batchSize || REQUESTS);

  var index = 0;
  var depth = 0;
  function processJob() {
    var batch = batches[index];
    batch.forEach(function(input) {
      q.push(input);
    });

    index++;
    if (index < batches.length)
      next();

    depth--;
    if (depth === 0)
      q.drain = cb;
  }

  function next() {
    depth++;
    setTimeout(processJob, opts.interval || INTERVAL);
  }
  next();
}
