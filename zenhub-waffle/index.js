'use strict';

var config = require('./.auth.json');
var exec = require('child_process').exec;
var spawn = require('cross-spawn');

getReposInOrgs();

function getReposInOrgs() {
  exec('curl https://api.github.com/orgs/strongloop/repos',
  (err, stdout) => {
    if (err) throw err;

    const response = JSON.parse(stdout);

    checkRateLimit(response);

    response.forEach(repo => {
      getIssuesFromRepo(repo.id, repo.name);
    });
  });
}

function getIssuesFromRepo(repoId, repoName) {
  exec(`curl https://api.github.com/repos/strongloop/${repoName}/issues`,
  (err, stdout) => {
    if (err) throw err;

    const response = JSON.parse(stdout);

    checkRateLimit(response);

    response.forEach(issue => {
      getPipelineForIssue(repoId, repoName, issue.number);
    });
  });
}

function getPipelineForIssue(repoId, repoName, issueNumber) {
  const token = config.zenhub.token;
  const url = `https://api.zenhub.io/p1/repositories/${repoId}
    /issues/${issueNumber}`;
  exec(`curl -H 'X-Authentication-Token: ${token}' {$url}`,
  (err, stdout) {
    if (err) throw err;

    var response = JSON.parse(stdout);

    checkRateLimit(response);

    for(var obj in responsePipelines) {
      if (obj !== 'pipeline')
        continue;

      var innerJsonObj = responsePipelines[obj];
      for (var innerObj in innerJsonObj)
        replaceLabelNameWithPipeline(innerJsonObj[innerObj], repoName, issueNumber);
    }
  });
}

function replaceLabelNameWithPipeline(pipelineName, repoName, issueNumber) {
  const username = config.github.username:
  const token = config.github.token:
  const credentials = `${username}:${token}`;

  const urlToReplace = `https://api.github.com/repos/strongloop/${repoName}/
  const labelData = `[{"name": "${pipelineName}"}]`;
    issues/${issueNumber}/labels`;
  spawn('curl', [
    '-u', credentials,
    '-X', 'PUT',
    urlToReplace,
    '-d', labelData
  ], {stdio: 'inherit'});
}

function checkRateLimit(response) {
  if (response && response.message.startsWith('API rate limit exceeded'))
    throw new Error(response.message);
}
