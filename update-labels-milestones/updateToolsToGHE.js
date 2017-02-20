"use strict";
var _ = require('lodash');
var fs = require('fs');
var spawn = require('cross-spawn');
var exec = require('child_process').exec;

var contents = fs.readFileSync("github-tools.json");
var jsonContent = JSON.parse(contents);
var credentials; // Engter crendentials manually e.g 'sspai:github token';

mainFunction();

function mainFunction() {
	let repo;

	for (let i in jsonContent.repos) {
		repo = jsonContent.repos[i];
		updateApimeshLabels(repo.name);
		updateApimeshMilestones(repo.name);

	}		
};

function updateApimeshLabels(repoName) {
	var url_post_labels = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/labels';
	var cmd_getLabels = 'curl -u ' + credentials + ' https://github.ibm.com/api/v3/repos/apimesh/scrum-asteroid/labels';
	var child, labelsArray = [];
	
	for (var i in jsonContent.labels)
    	labelsArray.push(jsonContent.labels[i]);

	child = exec(cmd_getLabels, function (error, stdout, stderr) {

	var responseLabels = JSON.parse(stdout);

	for (var obj in responseLabels){
	  var url_delete_label = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/labels/' + responseLabels[obj].name;
      if ((index = _.findIndex(labelsArray, { name: responseLabels[obj].name })) < 0) {
	        console.log(repoName + ': Deleting label: ' + responseLabels[obj].name);
			var child = spawn('curl', ['-u' , credentials, '-X', 'DELETE', url_delete_label ], { stdio: 'inherit' });
	        
	    } else {
	        _.pullAt(labelsArray, [ index ]);
	    }

	}
      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });

	for (let i in jsonContent.labels) {
		let label = jsonContent.labels[i];
		var labelString = JSON.stringify(label);
		var child = spawn('curl', ['-i', '-d', labelString , '-u' , credentials, '-X', 'POST', url_post_labels ], { stdio: 'inherit' });
	}
};

}

function updateApimeshMilestones(repoName) {
	var url_post_milestones = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/milestones';
	var cmd_getMilestones = 'curl -u ' + credentials + ' https://github.ibm.com/api/v3/repos/apimesh/scrum-asteroid/milestones';
	var child, milestonesArray = [];
	
	for (var prop in jsonContent.milestones) {
    	milestonesArray.push(jsonContent.milestones[prop]);
	}

	child = exec(cmd_getMilestones, function (error, stdout, stderr) {

	var responseMilestones = JSON.parse(stdout);

	for (var obj in responseMilestones){
	  var url_delete_milestone = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/milestones/' + responseMilestones[obj].number;
      if ((index = _.findIndex(milestonesArray, { title: responseMilestones[obj].title })) < 0) {
	        console.log(repoName + ': Deleting milestone: ' + responseMilestones[obj].title);
			var child = spawn('curl', ['-u' , credentials, '-X', 'DELETE', url_delete_milestone ], { stdio: 'inherit' });
	        
	    } else {
	        _.pullAt(milestonesArray, [ index ]);
	    }

	}
      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });

	for (let i in jsonContent.milestones) {
	    let milestone = jsonContent.milestones[i];
	    var milestoneString = JSON.stringify(milestone);
	    var child = spawn('curl', ['-i', '-d', milestoneString , '-u' , credentials, '-X', 'POST', url_post_milestones ], { stdio: 'inherit' });
	}
};

}