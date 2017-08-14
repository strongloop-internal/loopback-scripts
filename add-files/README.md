# Add File to GitHub
The purpose of this script is to
1. Create a branch
2. Add a file to the branch
3. Create a PR off the branch

## Installation
```
git clone git@github.com:strongloop-internal/loopback-scripts.git
cd loopback-scripts/add-files
npm install
``` 

## Usage
- Create `add-files/.auth.json` with username and password.
- Run `npm start`

### Example of .auth.json 
```
{
    "username": "test@ca.ibm.com",
    "password": "somepassword"
}
```


