"use strict";
var _ = require('lodash');
var fs = require('fs');
var spawn = require('cross-spawn');

var contents = fs.readFileSync("github-tools.json");
var jsonContent = JSON.parse(contents);
var credentials; // Engter crendentials manually e.g 'sspai:github token';

mainFunction();

function mainFunction() {
	addApimeshLabels(jsonContent.repos.name);
	addApimeshMilestones(jsonContent.repos.name);		
};
	
function addApimeshLabels(repoName) {
	var url = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/labels';

	for (let i in jsonContent.labels) {
		let label = jsonContent.labels[i];
		var labelString = JSON.stringify(label);
		var child = spawn('curl', ['-i', '-d', labelString , '-u' , credentials, '-X', 'POST', url ], { stdio: 'inherit' });
	}
};

function addApimeshMilestones(repoName) {
	var url = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/milestones';

	for (let i in jsonContent.milestones) {
	    let milestone = jsonContent.milestones[i];
	    var milestoneString = JSON.stringify(milestone);
	    var child = spawn('curl', ['-i', '-d', milestoneString , '-u' , credentials, '-X', 'POST', url ], { stdio: 'inherit' });
	}
};
