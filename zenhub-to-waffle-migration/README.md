# zenhub-to-waffle-migration

The intent of this script is to migrate all issues from zenhub to waffle


## Installation

- Git clone git@github.com:strongloop-internal/loopback-scripts.git

- cd zenhub-to-waffle-migration

- Create .auth.json file having the following content
	{
  		"github": {
    		"username": "Insert-git-username-here",
    		"token": "Insert-git-token-here"
  		},
 		"zenhub": {
    		"token": "Insert-zenhub-token-here"
  		}
	}


- To generate git token
	- Settings > Personal access tokens > Generate New Token

- To generate zenhub token
	- Go to https://dashboard.zenhub.io/#/settings
	- Generate New Token

- npm install

- node .


## Usage

```
npm start
```
