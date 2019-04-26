'use strict';

/*
 * List of repos to have the file added
 */
const repos = require('./repos.json');

// git clone all the repos listed in the repos.json
// Run the `slt-copyright` command
const shell = require('shelljs');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

var index = 0;
var orgName = '';
var repoName = '';
const BRANCH_NAME = 'copyrights';

shell.mkdir('repos');
shell.cd('repos');

repos.forEach(repo => {
    index = repo.indexOf('/');
    orgName = repo.substring(0, index);
    repoName = repo.substring(index+1, repo.length);
    console.log('Repo org: ', orgName, ', Repo name: ', repoName);
    //git clone the repo and run `slt copyright` again the repo
    shell.exec('../slt-copyright.sh ' + repo + ' ' + repoName);
});
