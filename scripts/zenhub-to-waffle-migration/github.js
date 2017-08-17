'use strict';

var config = require('./.auth.json');
var exec = require('child_process').exec;
var async = require('async');
const waffle = require('./waffle');

var userName = config.github.username;
var token = config.github.token;
const credentials = `${userName}:${token}`;

exports.removeLabelsFromIssue = removeLabelsFromIssue;
exports.addWaffleLabelToIssue = addWaffleLabelToIssue;
exports.getAllIssuesOfRepo = getAllIssuesOfRepo;

/* Get All git issues from the repo */
function getAllIssuesOfRepo(pageNo, repoName, callback) {
  exec(`curl https://api.github.com/repos/${repoName}/issues?page=${pageNo} -u ${credentials}`,
    (err, stdout) => {
      if (err) return callback(err);
      callback(err, stdout);
    });
}

/* return array of issues labels */
function getLabels(issueNumber, repoName, cb) {
  var issueAllLabelsArray = [];
  exec(`curl https://api.github.com/repos/${repoName}/issues/${issueNumber}/labels -u ${credentials}`,
    (err, stdout) => {
      if (err) throw (err);
      	var issueLabels = JSON.parse(stdout);
      	issueLabels.forEach(issueLabel => {
      		issueAllLabelsArray.push(issueLabel);
      	});
      	cb(null, issueAllLabelsArray);
    });
}

/* remove irrelevent waffle label from an issue */
function removeLabelsFromIssue(issueNumber, repoName, labels, callback) {
  async.each(labels, function(label, cb) {
    removeLabelFromIssue(issueNumber, repoName, label, cb);
  }, callback);
}

function removeLabelFromIssue(issueNumber, repoName, label, cb) {
  label = label.replace('#', '%23');
  const cmd = `curl -u ${credentials} -XDELETE https://api.github.com/repos/${repoName}/issues/${issueNumber}/labels/${label}`;
  exec(cmd, cb);
}

/* Add expected waffle label to an issue */
function addWaffleLabelToIssue(issueNumber, repoName, pipeline, cb) {
  pipeline = '#' + pipeline.replace(' ', '-').toLowerCase();
  var labelData = `'[{"name":"${pipeline}"}]'`;
  labelData = JSON.parse(JSON.stringify(labelData));
  const cmd = `curl -u ${credentials} -d ${labelData} -XPOST https://api.github.com/repos/${repoName}/issues/${issueNumber}/labels`;
  exec(cmd, cb);
}
