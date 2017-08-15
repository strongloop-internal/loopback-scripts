'use strict';

const assert = require('assert');
const Octokat = require('octokat');

module.exports = Util;

function Util(creds) {
  this.octo = new Octokat(creds);
};

/**
 * Create a branch in a repo
 *
 * @param {String} base The base branch
 * @param {String} branchName The name of the branch
 * @param {Object} options Options config to specify owner and repo
 * @property {String} owner The owner of the repository
 * @property {String} repoName The name of the repository
 * @callback {Function} cb The callback function
 */
Util.prototype.createBranch = function(base, branchName, options, cb) {
  assert(typeof branchName === 'string');
  assert(typeof options === 'object');
  assert(typeof cb === 'function');

  var owner = options.owner;
  var repoName = options.repoName;
  var repo = this.octo.repos(owner, repoName);

  repo.commits.fetch({sha: base}, function(err, commits) {
    if (err) cb(err);
    var lastCommit = commits.items[0];
    repo.git.refs.create({'ref': 'refs/heads/' + branchName,
      'sha': lastCommit.sha}, cb);
  });
};

/**
 * Delete a branch in a repo
 *
 * @param {String} branchName The name of the branch
 * @param {Object} options Options config to specify owner and repo
 * @property {String} owner The owner of the repository
 * @property {String} repoName The name of the repository
 * @callback {Function} cb The callback function
 */
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

/**
 * Add a file and commit to a branch
 *
 * @param {String} file The name of the file
 * @param {Object} config The required config with commit message and file content
 * @property {String} message The commit message
 * @property {String} content The file contents (needs to be base64)
 * @property {String} branch The branch to commit on to
 * @param {Object} options Options config to specify owner and repo
 * @property {String} owner The owner of the repository
 * @property {String} repoName The name of the repository
 * @property {String} base The base branch
 * @callback {Function} cb The callback function
 */
Util.prototype.addFile = function(file, config, options, cb) {
  assert(typeof file === 'string');
  assert(typeof config === 'object');
  assert(typeof options === 'object');
  assert(typeof cb === 'function');

  var owner = options.owner;
  var repoName = options.repoName;
  var base = options.base;
  var repo = this.octo.repos(owner, repoName);

  repo.contents(file).fetch(function(err, info) {
    if (err) {
      config.sha = base;
    } else {
      config.sha = info.sha;
    }
    repo.contents(file).add(config, function(err, info) {
      if (err) cb(err);
      cb(err, info);
    });
  });
};

/**
 * Create a pull request
 *
 * @param {Object} config Pull request configurations
 * @property {String} title The title of the pull request
 * @property {String} body The body message of the pull request
 * @property {String} head The branch name of the pull request made from
 * @property {String} base The base branch of the pull request made to
 * @param {Object} options Options config to specify owner and repo
 * @property {String} owner The owner of the repository
 * @property {String} repoName The name of the repository
 * @callback {Function} cb The callback function
 */
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
