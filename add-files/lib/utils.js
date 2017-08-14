'use strict';

const Octokat = require('octokat');

module.exports = Utils;

function Utils(creds) {
  this.octo = new Octokat(creds);
};

/**
 * Add file
 * 1. Create branch
 * 2. Add file to the newly created branch
 * 3. Create a PR
 */
Utils.prototype.addFile = function(owner,
    repoName, branchName, fileName, commitMessage, content) {
  var repo = this.octo.repos(owner, repoName);
  // create branch
  Utils.prototype.createBranch(repo, branchName, (res)=> {
    // add file to the newly created branch
    console.log('after creating branch, result = ', res);

    var config = {
      message: commitMessage,
      content: content,
      branch: branchName,
    };
    console.log('fileName = ', fileName);
    // repo.contents(fileName).add(config);
    repo.contents(fileName).add(config).then((info)=> {
      console.log('File', fileName, 'has been added to branch ', branchName);
      console.log(info.commit.sha);
      Utils.prototype.createPR(repo, branchName);
    });
  });
};

/**
 * Create branch of the specified repo
 */
Utils.prototype.createBranch = function(repo, branchName, cb) {
  // get the SHA from the last commit to create a branch
  repo.commits.fetch({sha: 'master'}).then(function(commits) {
    // first item of the commits array is the lastest commit
    var lastCommit = commits.items[0];
    repo.git.refs.create({'ref': 'refs/heads/' + branchName,
      'sha': lastCommit.sha}, cb);
  });
};

Utils.prototype.createPR = function(repo, branchName) {
  console.log('creating pr...', repo);

  // repo.merges.create({base: branchName, head: 'master', commitMessage: 'test'});
  repo.pulls.create({title: 'Add CODEOWNER file',
    body: 'Add CODEOWNER file',
    head: branchName,
    base: 'master'},
    (res)=> {
      console.log('createPR = ', res);
    });
};
