## Installation

```
$ git clone git@github.com:strongloop-internal/loopback-scripts.git
$ cd loopback-scripts/update-labels-milestones
```

## github-tools.json

The json file has three sections: `labels`, `milestones` and
`repos'.

## addToolsToGHE.js

The js file which adds labels to github repositories which are in github-tools.json as repos.

## updateToolsToGHE.js

The js file which deletes existing labels and adds new labels to github repositories which are in github-tools.json as repos.

### `labels`

An object describing labels shared by all github repositories. Label name is
the key, label color is the value.

```
"labels": {
    "test-7": "c5def6",
}
```

### `milestones`

An object describing milestones shared by all github repositories. Milestone
title is used as the key.

Supported values:

 - a string - the due date(due_on) in the format `yyyy-mm-ddTHH:MM:SSZ`

```
"milestones": {
	"Sprint499":"2017-04-04T00:00:00Z"
}
```

### `repos`

An array of all repositories to synchronize.

```
"repos": [
	"scrum-asteroid"
]
```

