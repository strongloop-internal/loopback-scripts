'use strict';

const config = require('./.auth.json');
const exec = require('child_process').exec;

exports.getPipelineForIssue = getPipelineForIssue;

const token = config.zenhub.token;

/* Get pipeline name for an issue */
function getPipelineForIssue(issueNumber, repoId, repoName, cb) {
  const url = `https://api.zenhub.io/p1/repositories/${repoId}/issues/${issueNumber}`;
  console.log(url);
  exec(`curl -H 'X-Authentication-Token: ${token}' ${url}`, (err, stdout) => {
    if (err) return cb(err);
    console.log(stdout + repoName + issueNumber);
    const res = JSON.parse(stdout);

    const pipelineName = res.pipeline.name;
    cb(null, pipelineName);
  });
}
