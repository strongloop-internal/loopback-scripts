"use strict";
var _ = require('lodash');
var fs = require('fs');
var spawn = require('cross-spawn');
var exec = require('child_process').exec;

var contents = fs.readFileSync("github-tools.json");
var jsonContent = JSON.parse(contents);
var credentials; // Enter crendentials manually e.g 'username:github token';

mainFunction();

function mainFunction() {
	for(var i in jsonContent.repos)
  {
	updateApimeshLabels(jsonContent.repos[i]);	
	updateApimeshMilestones(jsonContent.repos[i]);	
  }
};

function updateApimeshLabels(repoName) {
	var url_post_labels = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/labels';
	var cmd_getLabels = 'curl -u ' + credentials + ' https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/labels';
	var child, labelsArray = [];

	for (var i in jsonContent.labels) {
		let label = jsonContent.labels[i];
		var labelString = "{\"name\""+ ":\"" + i + "\",\"color\":\"" + label + "\"}";
		var jsonLabelString = JSON.parse(labelString);
    	labelsArray.push(jsonLabelString);
	}

 	child = exec(cmd_getLabels, function (error, stdout, stderr) {
	var responseLabels = JSON.parse(stdout);

	for (var obj in responseLabels){
	  var index;
	  var url_delete_label = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/labels/' + responseLabels[obj].name;
    	
      if ((index = _.findIndex(labelsArray, { name: responseLabels[obj].name })) < 0) {
	        console.log(repoName + ': Deleting label: ' + responseLabels[obj].name);
			var child = spawn('curl', ['-u' , credentials, '-X', 'DELETE', url_delete_label ], { stdio: 'inherit' });
    
	    } else {
	        _.pullAt(labelsArray, [ index ]);
	    }

	}

	var jsonArray   = JSON.stringify(labelsArray);
	var jsonObject = JSON.parse(jsonArray);
	for(var i in jsonObject)
	{
		var jsonString = JSON.stringify(jsonObject[i]);
		var child = spawn('curl', ['-i', '-d', jsonString , '-u' , credentials, '-X', 'POST', url_post_labels ], { stdio: 'inherit' });
	}
	

      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });
}

function updateApimeshMilestones(repoName) {
	var url_post_milestones = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/milestones';
	var cmd_getMilestones = 'curl -u ' + credentials + ' https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/milestones';
	var child, milestonesArray = [];

	for (var i in jsonContent.milestones) {
		let milestone = jsonContent.milestones[i];
		var milestoneString = "{\"title\""+ ":\"" + i + "\",\"due_on\":\"" + milestone + "\"}";
		var jsonMilestoneString = JSON.parse(milestoneString);
    	milestonesArray.push(jsonMilestoneString);
	}



 	child = exec(cmd_getMilestones, function (error, stdout, stderr) {
	var responseMilestones = JSON.parse(stdout);

	for (var obj in responseMilestones){
	  var index;
	  var url_delete_milestone = 'https://github.ibm.com/api/v3/repos/apimesh/' + repoName + '/milestones/' + responseMilestones[obj].number;
    	
      if ((index = _.findIndex(milestonesArray, { title: responseMilestones[obj].title })) < 0) {
	        console.log(repoName + ': Deleting milestone: ' + responseMilestones[obj].title);
			var child = spawn('curl', ['-u' , credentials, '-X', 'DELETE', url_delete_milestone ], { stdio: 'inherit' });
    
	    } else {
	        _.pullAt(milestonesArray, [ index ]);
	    }

	}

	var jsonArray   = JSON.stringify(milestonesArray);
	var jsonObject = JSON.parse(jsonArray);
	for(var i in jsonObject)
	{
		var jsonString = JSON.stringify(jsonObject[i]);
		var child = spawn('curl', ['-i', '-d', jsonString , '-u' , credentials, '-X', 'POST', url_post_milestones ], { stdio: 'inherit' });
	}
	

      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });
}