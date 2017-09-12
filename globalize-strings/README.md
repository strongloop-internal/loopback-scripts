## Globalize strings
The script does the following:
1. Git clone the repos specified in `repos.json` to the current directory
2. Go through each downloaded repo and run `slt-globalize`.  
3. The output text is saved under `output.txt`. 

Note: the script is written in Unix shell/bash syntax and will only run in unix shell.

## Installation
Make sure you have the following packages installed:
1. `git-walk` (https://www.npmjs.com/package/git-walk)
2. `strong-globalize` (https://www.npmjs.com/package/strong-globalize)

## Running the script
Just run the script:
```
./globalize.sh
```
