## Update copyrights headers
This script goes through all the repo listed in `repos.json` and run `slt copyright` command to update/insert copyright headers.

## Running the script
1. Create a file called `.auth.json` under `/update-copyrights` folder. The content should look something like:
```json
{
    "username": "your-useremail-for-github",
    "password": "your-github-password"
}
```
Run `npm start`.
