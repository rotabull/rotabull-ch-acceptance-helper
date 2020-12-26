const core = require("@actions/core");
const checkers = require("./lib/checkers");
const github = require('@actions/github');

const GITHUB_TOKEN = core.getInput("github-token");
const CLUBHOUSE_TOKEN = core.getInput("clubhouse-token");

async function run() {
  try {
    switch (github.context.eventName) {
      case 'pull_request':
        await checkers.clubhouseAcceptance(github.context.payload.number, GITHUB_TOKEN, CLUBHOUSE_TOKEN);
      case 'repository_dispatch':
      // search for PR based on [chXYZ] in title
      // get SHA of latest
      // send post using Clubhouse info on dispatch to github SHA
      default:
        console.error("Unsupported Event Type; only `pull_request` and `repository_dispatch` allowed");
    }
  } catch (error) {
    console.log(error.stack);
    core.setFailed(error.message);
  }
}

run();
