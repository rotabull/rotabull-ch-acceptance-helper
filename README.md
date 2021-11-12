# Rotabull Clubhouse Acceptance Helper action

This action verifies that the Clubhouse story associated with a PR has been accepted.
It looks for the "Accepted" label and sends a passing or failing Status Check by sending
a POST: `/repos/{owner}/{repo}/statuses/{sha}`.

See the [docs on Github](https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-a-commit-status) for more

## Example usage

```yaml
on:
  # Future functionality
  # repository_dispatch:
  #   types: ["shortcut-acceptance"]
  pull_request:
    types: [opened, synchronize, reopened]

uses: rotabull/rotabull-ch-acceptance-helper@main
with:
  github-token: '123'
  clubhouse-token: '123'
  ......
```

## Events

This action can be run on `pull_request`.

In the future, it may also be run on a `repository dispatch`. In the case of a repository dispatch, a client payload must be provided:

```
{
"event_type": "shortcut-acceptance",
"client_payload": {
        "story_id": 1234,
        "accepted": true
    }
}
```

## Inputs

### `github-token`

**Required** Github token, added by Github workflow as an env var. It's used
in order to call Github API.

### `clubhouse-token`

**Required** Clubhouse API, token added by Github workflow as an env var. It's used in order to call Clubhouse API.


## Development

```bash
npm install
```

```bash
npm test
```

## Build

This project uses [ncc](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github
) to build a new distribution version of it:

```bash
npm i -g @vercel/ncc
```

```bash
ncc build index.js --license licenses.txt
```
