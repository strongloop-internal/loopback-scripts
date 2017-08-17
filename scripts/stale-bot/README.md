# LoopBack issue/pull-request templates

An internal tooling that allows to define issue and pull-request templates and apply across loopback repos.

To run the script, login with your github account or use an OAuth token:
```bash
node index.js --token <my_github_token>
```
OR
```bash
node index.js --user <my_github_username> --password <my_github_password>
```

To perform a dry run, use the `--dry-run` flag.
