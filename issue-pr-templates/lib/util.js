'use strict';

const assert = require('assert');
const Octokat = require('octokat');

module.exports = Util;

function Util(creds) {
  this.octo = new Octokat(creds);
};

Util.prototype.createBranch = function(branchName, options, cb) {
  assert(typeof branchName === 'string');
  assert(typeof options === 'object');
  assert(typeof cb === 'function');

  var owner = options.owner;
  var repoName = options.repoName;
  var repo = this.octo.repos(owner, repoName);

  repo.commits.fetch({sha: 'master'}, function(err, commits) {
    if (err) cb(err);
    var lastCommit = commits.items[0];
    repo.git.refs.create({'ref': 'refs/heads/' + branchName,
      'sha': lastCommit.sha}, cb);
  });
};

Util.prototype.deleteBranch = function(branchName, options, cb) {
  assert(typeof branchName === 'string');
  assert(typeof options === 'object');
  assert(typeof cb === 'function');

  var owner = options.owner;
  var repoName = options.repoName;
  var repo = this.octo.repos(owner, repoName);

  repo.git.refs('heads', branchName).remove(function(err, result) {
    if (err) cb(err);
    cb(err, result);
  });
};

Util.prototype.addFile = function(file, config, options, cb) {
  assert(typeof file === 'string');
  assert(typeof config === 'object');
  assert(typeof options === 'object');
  assert(typeof cb === 'function');

  var owner = options.owner;
  var repoName = options.repoName;
  var repo = this.octo.repos(owner, repoName);

  repo.contents(file).fetch(function(err, info) {
    if (err) cb(err);
    config.sha = info.sha;
    repo.contents(file).add(config, function(err, info) {
      if (err) cb(err);
      cb(err, info);
    });
  });
};

Util.prototype.createPR = function(config, options, cb) {
  assert(typeof config === 'object');
  assert(typeof options === 'object');
  assert(typeof cb === 'function');

  var owner = options.owner;
  var repoName = options.repoName;
  var repo = this.octo.repos(owner, repoName);

  repo.pulls.create(config, function(err, res) {
    if (err) cb(err);
    cb(err, res);
  });
};
