'use strict';

var exec = require('child_process').exec;
var reposOfJsonFile = require('./repos.json');
var async = require('async');
const github = require('./github');
const zenhub = require('./zenhub');
const waffle = require('./waffle');
const pagination = require('./pagination');

/* Fetch All repos from file */
updateForAllRepos();
function updateForAllRepos() {
  var reposJson = reposOfJsonFile.repos;
  var repoIds = Object.keys(reposJson);
  repoIds.forEach(repoId => {
    updateAllIssues(reposJson[repoId], repoId);
  });
}

/* Loop over all repo issues for update */
function updateAllIssues(repoId, repoName, callback) {
  pagination.getNumberOfPages(repoName, function(err, pagesToIterate) {
    async.each(pagesToIterate, function(pageNo, cb) {
      github.getAllIssuesOfRepo(pageNo, repoName, function(err, results) {
        if (err) throw err;
        var issues = JSON.parse(results);
        async.each(issues, function(issue, cb) {
          // if ((repoId == 20100867 && issue.number == 38) || (repoId == 20100867 && issue.number == 46) || (repoId == 9530789 && issue.number == 433))
          updateIssue(issue.number, repoId, repoName, cb);
        }, callback);
      });
    });
  });
}

/* update an issue for a specific repo */
function updateIssue(issueNo, repoId, repoName, callback) {
 // console.log(repoName, issueNo);
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
