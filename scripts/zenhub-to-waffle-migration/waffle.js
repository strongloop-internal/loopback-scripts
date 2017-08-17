'use strict';

var config = require('./.auth.json');
var exec = require('child_process').exec;
var spawn = require('cross-spawn');
var reposOfJsonFile = require('./repos.json');
var async = require('async');
var each = require('async-each');
const github = require('./github');

exports.removeIrrelevantWaffleLabelsFromIssue =
removeIrrelevantWaffleLabelsFromIssue;
exports.getIssueWaffleLabels = getIssueWaffleLabels;

function removeIrrelevantWaffleLabelsFromIssue(issueNumber,
repoId, repoName, pipeline, cb) {
  var waffleLabels = getAllWaffleLabels();

  var irreleventWaffleLabels = [];
  waffleLabels.forEach(waffleLabel => {
    if (waffleLabel != pipeline)
      irreleventWaffleLabels.push(waffleLabel);
  });
  github.removeLabelsFromIssue(issueNumber,
    repoName, irreleventWaffleLabels, cb);
}

function getAllWaffleLabels() {
  var waffleLabels = [
    '#triaging',
    '#needs-priority',
    '#needs-estimate',
    '#backlog',
    '#planning',
    '#committed',
    '#in-progress',
    '#paused',
    '#review',
    '#verify',
    '#tbr',
  ];
  return waffleLabels;
}

function getIssueWaffleLabels(issueNumber, repoName, cb) {
  // return all labels for an issue with # in front of it
  var issueWaffleLabelsArray = [];
  var issueLabelName;
  exec(`curl https://api.github.com/repos/${repoName}/issues/${issueNumber}/labels`,
    (err, stdout) => {
    	console.log(`curl https://api.github.com/repos/${repoName}/issues/${issueNumber}/labels`);
      if (err) throw (err);
      	var issueLabels = JSON.parse(stdout);
      	issueLabels.forEach(issueLabel => {
      	  issueLabelName = issueLabel.name;
      	  if (issueLabelName.startsWith('#')) {
      		issueWaffleLabelsArray.push(issueLabelName);
      	}
      	});
      	cb(null, issueWaffleLabelsArray);
    });
}
