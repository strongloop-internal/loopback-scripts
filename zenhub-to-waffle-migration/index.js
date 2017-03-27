'use strict';

var exec = require('child_process').exec;
var reposOfJsonFile = require('./repos.json');
var async = require('async');
const github = require('./github');
const zenhub = require('./zenhub');
const waffle = require('./waffle');
const pagination = require('./pagination');
var _ = require('lodash');
var Batch = require('batch');
var batch = new Batch;
var scheduler = require('./scheduler');

/* Fetch All repos from file */
updateForAllRepos(function() {
  console.log('done');
});

function updateForAllRepos(cb) {
  var reposJson = reposOfJsonFile.repos;
  var repoIds = Object.keys(reposJson);
  repoIds.forEach(repoId => {
    updateAllIssues(reposJson[repoId], repoId, cb);
  });
}

/* Loop over all repo issues for update */
function updateAllIssues(repoId, repoName, callback) {
  pagination.getNumberOfPages(repoName, function(err, pagesToIterate) {
    var totalIssues = [];
    async.each(pagesToIterate, function(pageNo, cb) {
      github.getAllIssuesOfRepo(pageNo, repoName, function(err, results) {
        if (err) throw err;
        var issues = JSON.parse(results);
        issues.forEach(function(issue) {
          totalIssues.push(issue.number);
        });
        cb();
      });
    }, function(err) {
      if (err) throw err;
      run(totalIssues, repoId, repoName, callback);
    });
  });
}

function run(issues, repoId, repoName, cb) {
  scheduler.schedule({
    inputs: issues,
    job: function(issueNumber, cb) {
      updateIssue(issueNumber, repoId, repoName, cb);
    },
  }, cb);
}

/* update an issue for a specific repo */
function updateIssue(issueNo, repoId, repoName, callback) {
  zenhub.getPipelineForIssue(issueNo, repoId, repoName,
  function(err, pipeline) {
    if (err) throw err;
    async.waterfall(
      [
        function(cb) {
          waffle.removeIrrelevantWaffleLabelsFromIssue(issueNo, repoId,
          repoName, pipeline, cb);
        },
        function(cb) {
          github.addWaffleLabelToIssue(issueNo, repoName, pipeline, cb);
        },
      ],
      callback
    );
  });
}
