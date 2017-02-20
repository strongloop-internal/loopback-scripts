## Installation

```
$ git@github.com:strongloop-internal/loopback-scripts.git
$ cd loopback-scripts/update-labels-milestones
```

## github-tools.json

The json file has three sections: `labels`, `milestones` and `repos'.

## addToolsToGHE.js

This script adds new labels to  repositories which are listed in github-tools.json as repos.

## updateToolsToGHE.js

This script deletes existing labels and adds new labels to github repositories which are listedin github-tools.json as repos.

### `labels`

An object describing labels shared by all github repositories. Label name is
the key, label color is the value.

```
"labels": {
  "name": "test",
  "value": "eeeee"
}
```

### `milestones`

An object describing milestones shared by all github repositories. Milestone
title is used as the key.

Supported values:

 - a string - the due date in the format `yyyy-mm-dd`
 - `false` - the milestone is closed.

```
"milestones": {
  "title": "Sprint 1",
  "due_on": "2017-03-20"
}
```

### `repos`

An array of all repositories to synchronize.

```
"repos": [
	"name": "scrum-asteroid"
]
```

