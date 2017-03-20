# zenhub-to-waffle-migration

The intent of this script is to migrate all issues from ZenHub pipelines to
Waffle columns.

## Installation

```
git clone git@github.com:strongloop-internal/loopback-scripts.git
cd loopback-scripts/zenhub-to-waffle-migration
npm install
```

## Usage

- Create `zenhub-to-waffle-migration/.auth.json` with username and [generated
access tokens](#generating-access-token)
- `npm start`

## Generating access tokens

Create `.auth.json`:

```
{
  "github": {
    "username": "your-github-username",
    "token": "your-github-peronsal-access-token"
  },
  "zenhub": {
    "token": "your-zenhub-token"
  }
}
```

### How to generate a GitHub personal access token

In the GitHub UI, go to:

- Settings
- Personal access tokens
- Generate New Token

### How to generate a ZenHub access token

- Go to https://dashboard.zenhub.io/#/settings
- Generate New Token
