"use strict";
var _ = require('lodash');
var fs = require('fs');
var spawn = require('cross-spawn');

var contents = fs.readFileSync("github-tools.json");
var jsonContent = JSON.parse(contents);
var credentials;// Enter crendentials manually e.g 'username:github token';

mainFunction();

function mainFunction() {
	for(var i in jsonContent.repos)
  {
	addApimeshLabels(jsonContent.repos[i]);	
	addApimeshMilestones(jsonContent.repos[i]);	
  }
};
	
function addApimeshLabels(repoName) {
	var url = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/labels';
	
	for (let i in jsonContent.labels) {
		let label = jsonContent.labels[i];

		var labelString = "{\"name\""+ ":\"" + i + "\",\"color\":\"" + label + "\"}";
		var jsonLabelString = JSON.parse(labelString);
		var jsonLabelStringify = JSON.stringify(jsonLabelString);
		var child = spawn('curl', ['-i', '-d', jsonLabelStringify , '-u' , credentials, '-X', 'POST', url ], { stdio: 'inherit' });
	};
}

function addApimeshMilestones(repoName) {
	var url = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/milestones';
	
	for (let i in jsonContent.milestones) {
		let milestone = jsonContent.milestones[i];
		var milestoneString = "{\"title\""+ ":\"" + i + "\",\"due_on\":\"" + milestone + "\"}";
		var jsonMilestoneString = JSON.parse(milestoneString);
		var jsonMilestoneStringify = JSON.stringify(jsonMilestoneString);
		console.log(jsonMilestoneStringify);
		var child = spawn('curl', ['-i', '-d', jsonMilestoneStringify , '-u' , credentials, '-X', 'POST', url ], { stdio: 'inherit' });
	};


	}
			