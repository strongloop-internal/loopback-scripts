'use strict';

var config = require('./.auth.json');
var config = require('./.auth.json');
var exec = require('child_process').exec;
var async = require('async');

exports.getNumberOfPages = getNumberOfPages;

var userName = config.github.username;
var token = config.github.token;
const credentials = `${userName}:${token}`;

/* Get number of pages of issues for a repo */
function getNumberOfPages(repoName, callback) {
  var page = 1;
  var hasNextPage = true;
  var pagesToIterate = [];
  async.whilst(
    function() {
      return hasNextPage;
    },
    function(cb) {
      exec(`curl https://api.github.com/repos/${repoName}/issues?page=${page} -u ${credentials}`,
      (err, stdout) => {
        if (err) return cb(err);

        // note:number of issues per page is 30 according to github API
        // does this repo have > 0 && < 30 issues
        var isFirstPage = page === 1;
        var numberOfItemsOnPage = JSON.parse(stdout).length;

        // no (noOfIssues === 0) and first page
        if (isFirstPage && numberOfItemsOnPage === 0) {
          hasNextPage = false;
          return cb;
        }

         // if items < 30 push in array
        if (numberOfItemsOnPage < 30) { // default GH page limit (30 per page)
          hasNextPage = false;
          if (numberOfItemsOnPage != 0) {
            pagesToIterate.push(page);
          }
          return cb();
        }

        // if === 30, check next page
        var nextPage = page + 1;
        exec(`curl https://api.github.com/repos/${repoName}/issues?page=${nextPage} -u ${credentials}`,
        (err, stdout) => {
          if (err) return cb(err);

          pagesToIterate.push(page);

          var numberOfItemsOnNextPage = JSON.parse(stdout).length;
          if (numberOfItemsOnNextPage === 0) {
            hasNextPage = false;
            return cb();
          }

          page++;

          return cb();
        });
      });
    },
    function(err) {
      if (err) return callback(err);
      callback(null, pagesToIterate);
    }
  );
}
