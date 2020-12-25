const core = require("@actions/core");
const checkers = require("./lib/checkers");
const github = require('@actions/github');

console.log(context.eventName)

const GITHUB_TOKEN = core.getInput("github-token");
const CLUBHOUSE_TOKEN = core.getInput("clubhouse-token");

async function run() {
  try {
    await checkers.clubhouseAcceptance(github.context.payload.number, GITHUB_TOKEN, CLUBHOUSE_TOKEN);

    // If event is a repo dispatch
    // 1. find github PR associated w/story
    // 2. get SHA for latest commit on PR/branch
    // 3. send post using Clubhouse info on dispatch to github SHA
  } catch (error) {
    console.log(error.stack);
    core.setFailed(error.message);
  }
}

run();
