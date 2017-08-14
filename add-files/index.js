'use strict';

const creds = require('./.auth.json');
const Utils = require('./lib/utils');
const fs = require('fs');

/*
 * List of repos to have the file added
 */
const repos = require('./repos.json');
/*
 * Branch name
 */
var BRANCH_NAME = 'add-codeowner';
/*
 * File name to be committed to GitHub
 */
var FILE_NAME = 'CODEOWNERS';
/*
 * Commit message
 */
var COMMIT_MSG = 'Add CODEOWNER file';
/*
 * File where the template is
 */
var INPUT_FILEPATH = 'codeowner.txt';

/**
 * Authenticate using Basic Authentication
 * Read from .auth.json
 */
var utils = new Utils(creds);

/**
 * Read from CODEOWNER file template
 */
var content = fs.readFileSync(INPUT_FILEPATH);
var base64Content = new Buffer(content).toString('base64');

var index = 0;
var owner = '';
var repoName = '';

// Go through each repo and call addFile
repos.forEach(function(repo) {
  index = repo.indexOf('/');
  owner = repo.substring(0, index);
  repoName = repo.substring(index + 1, repo.length);
  console.log('Repo owner: ', owner, ', Repo name: ', repoName);
  utils.addFile(owner, repoName, BRANCH_NAME, FILE_NAME,
  COMMIT_MSG, base64Content);
}, this);
