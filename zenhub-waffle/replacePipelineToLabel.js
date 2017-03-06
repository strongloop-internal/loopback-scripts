"use strict";
var exec = require('child_process').exec;
var spawn = require('cross-spawn');

//Replace token with zenhub token from https://dashboard.zenhub.io/#/settings > Generate new token
var credentialsZenhub = '\'X-Authentication-Token: TOKEN\'';
var credentialsGit = 'username:token';

getReposInOrgs();

function getReposInOrgs() {
	var urlGetRepos = 'curl https://api.github.com/orgs/strongloop/repos';
	var repos;

	repos = exec(urlGetRepos, function (error, stdout, stderr) {
		var responseRepos = JSON.parse(stdout);
		for(var obj in responseRepos)
		{
			if(responseRepos[obj].id == 9530789)
			{
				getIssuesFromRepo(responseRepos[obj].id, responseRepos[obj].name);
			}
		}
		 if (error !== null) {
          console.log('exec error: ' + error);
      }

	});

}
function getIssuesFromRepo(repoId, repoName)
{
	var urlGetIssues = 'curl https://api.github.com/repos/strongloop/' + repoName + '/issues';

	var issues;

	issues = exec(urlGetIssues, function (error, stdout, stderr) {
		var responseIssues = JSON.parse(stdout);
		for(var obj in responseIssues)
		{
			if(responseIssues[obj].number == 381)
			{
				getPipelineForIssue(repoId, repoName, responseIssues[obj].number);
			}
		}
		 if (error !== null) {
          console.log('exec error: ' + error);
      }

	});

}

function getPipelineForIssue(repoId, repoName, issueNumber)
{	
	var url = 'https://api.zenhub.io/p1/repositories/' + repoId + '/issues/' + issueNumber + '';

	var urlGetPipelineName = 'curl -H ' + credentialsZenhub +  ' ' + url;

	var pipelines;

		pipelines = exec(urlGetPipelineName, function (error, stdout, stderr) {
		var responsePipelines = JSON.parse(stdout);
		for(var obj in responsePipelines)
		{
			if (obj != "pipeline")
				continue;

			var innerJsonObj = responsePipelines[obj];
			for (var innerObj in innerJsonObj){
				replaceLabelNameWithPipeline(innerJsonObj[innerObj], repoName, issueNumber)

			}
		}
		 if (error !== null) {
          console.log('exec error: ' + error);
      }

	});
}

function replaceLabelNameWithPipeline(pipelineName, repoName, issueNumber)
{
	var data = "[{\"name\": \"" + pipelineName + "\"}]";
	var jsonData = JSON.parse(data);	
	var jsonLabelData = JSON.stringify(jsonData);
	var urlToReplace = 'https://api.github.com/repos/strongloop/' + repoName + '/issues/' + issueNumber + '/labels';

	var result = spawn('curl', ['-u' , credentialsGit, '-X', 'PUT', urlToReplace, '-d', jsonLabelData ], { stdio: 'inherit' });

}

			