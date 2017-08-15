'use strict';

var argv = require('yargs')
  .option('u', {
    alias: 'username',
    describe: 'GitHub username',
  })
  .option('p', {
    alias: 'password',
    describe: 'GitHub password',
  })
  .option('t', {
    alias: 'token',
    describe: 'GitHub authentication token (can be used instead of password)',
  })
  .option('b', {
    alias: 'branch',
    describe: 'Branch name of the template',
    default: 'create-issue-pr-templates',
  })
  .option('d', {
    alias: 'dry-run',
    describe: 'Enable dry run. Dry-runs do not create the PR.',
  })
  .help('help')
  .argv;
var async = require('async');
var fs = require('fs');
var path = require('path');
var repos = require('../repos.json');
var _ = require('lodash');
var Util = require('./util.js');

const ISSUE_TEMPLATE = 'ISSUE_TEMPLATE.md';
const PR_TEMPLATE = 'PULL_REQUEST_TEMPLATE.md';

var issueFile = path.resolve(__dirname, '..', 'bin', ISSUE_TEMPLATE);
var prFile = path.resolve(__dirname, '..', 'bin', PR_TEMPLATE);

var branchName = argv.branch || argv.b || 'create-issue-pr-templates';
var files = [{issue: issueFile}, {pr: prFile}];

var user = argv.user || argv.u;
var password = argv.password || argv.p;
var token = argv.token || argv.t;
var dryRun = argv['dry-run'] || argv.d;
var util;

if (token) {
  util = new Util({token: token});
} else if (user && password) {
  util = new Util({username: user, password: password});
} else {
  throw new Error('Need to specify an OAuth token or GitHub credentials');
}

if (argv.dryRun) {
  console.log('*** This is a dry-run ***\n');
}

async.eachSeries(repos, function(repo, cb) {
  var owner = repo.split('/')[0];
  var repoName = repo.split('/')[1];
  var options = {
    owner: owner,
    repoName: repoName,
  };
  console.log('> Staging on repo: %s/%s', owner, repoName);
  util.createBranch(branchName, options, function(err, result) {
    if (err) throw err;
    async.eachSeries(files, function(file, cb) {
      var templateType = _.keys(file)[0];
      var commitMessage = 'create ' + templateType + ' template';
      var content = fs.readFileSync(file[templateType], {encoding: 'base64'});
      var config = {
        message: commitMessage,
        content: content,
        branch: branchName,
      };
      file = '.github/' + (templateType === 'issue' ? ISSUE_TEMPLATE :
        PR_TEMPLATE);
      util.addFile(file, config, options, function(err, result) {
        if (err) throw err;
        console.log('>> File added: %s', file);
        cb(err, result);
      });
    }, function(err) {
      if (dryRun) {
        util.deleteBranch(branchName, options, function(err, result) {
          if (err) cb(err);
          console.log('>> Deleted branch: %s/%s/%s\n', owner, repoName,
            branchName);
          cb(err, result);
        });
      } else {
        var prConfig = {
          title: 'Create Issue and PR Templates',
          body: 'Create Issue and PR Templates',
          head: branchName,
          base: 'master',
        };
        util.createPR(prConfig, options, function(err, result) {
          if (err) cb(err);
          console.log('>> Created PR on: %s/%s\n', owner, repoName);
          cb(err, result);
        });
      }
    });
  });
});
