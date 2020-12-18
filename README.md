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
