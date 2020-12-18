# Rotabull Clubhouse Acceptance Helper action

This action verify if a given Rotabull Pull-Request is associated with a
Clubhouse story so it checks if the story includes "Accepted" label and
flag the result to the Pull-Request.

## Inputs

### `github-token`

**Required** Github token, added by Github workflow as an env var. It's used
in order to call Github API.

### `clubhouse-token`

**Required** Clubhouse API, token added by Github workflow as an env var. It's used in order to call Clubhouse API.

## Outputs

### `message`

Internal outputs.

## Example usage

```yaml
# on: [pull_request]

uses: rotabull/rotabull-ch-acceptance-helper@main
with:
  github-token: '123'
  clubhouse-token: '123'
  ......
```

**Note** The workflow must include `pull_request` trigger.

## Project setup & tests

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
