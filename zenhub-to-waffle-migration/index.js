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

/* Fetch All repos from file */
// updateForAllRepos(function() {
//   console.log('done');
// });

function updateForAllRepos(cb) {
  // var reposJson = reposOfJsonFile.repos;
  // var repoIds = Object.keys(reposJson);
  // repoIds.forEach(repoId => {
  //   updateAllIssues(reposJson[repoId], repoId, cb);
  // });
}
updateAllIssues('10975056', 'strongloop/loopback-connector-mongodb');
/* Loop over all repo issues for update */
function updateAllIssues(repoId, repoName, callback) {
  pagination.getNumberOfPages(repoName, function(err, pagesToIterate) {
    console.log(pagesToIterate + 'pages');
    pagesToIterate.forEach(function(pageNo) {
      github.getAllIssuesOfRepo(pageNo, repoName, function(err, results) {
        if (err) throw err;
        var issues = JSON.parse(results);

        scheduleIssuesProcessing(issues, function(err, results) {
          console.log('hiiii');
        });

        // i need to push 30 issues of the 115 at a time to the queue
        // how do i get items at a time from `issues` -- batch

        // for each batch, run this (how large is each batch)
        // wait for 60 seconds between batches (async setTimeout?)

        // _.each(batch, function(issue) {
        //   q.push(batch, function(err) {
        //       if (err)
        //         console.log(' err here');
        //     }
        //   );
        // });

        // if all batches are done, call `callback`
      });
    });
  });
}

function scheduleIssuesProcessing(issues, callback) {
  var q = async.queue(function(issue, cb) {
     updateIssue(issue.number, '10975056', 'strongloop/loopback-connector-mongodb', callback);
    //console.log(issue.number + 'here!!!');
    cb();
  });

  var batches = _.chunk(issues, 30);
  // console.log(batches + '^^^^^^^^^^^^^^^^^^^^^^^');
  var batchIndex = 0;
  var queuelength = 0;

  function processIssues() {
    var issueBatch = batches[batchIndex];
    issueBatch.forEach(function(issue) {
      q.push(issue);
    });

    batchIndex++;
    if (batchIndex < batches.length)
      callProcessIssues();

    queuelength--;
    if (queuelength === 0)
      q.drain = callback;
  }

  function callProcessIssues() {
    queuelength++;
    setTimeout(processIssues, 60000);
  }
  callProcessIssues();
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
