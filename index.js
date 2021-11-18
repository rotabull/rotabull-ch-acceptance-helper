const core = require("@actions/core");
const checkers = require("./lib/checkers");
const github = require('@actions/github');

const GITHUB_TOKEN = core.getInput("github-token");
const CLUBHOUSE_TOKEN = core.getInput("clubhouse-token");

async function run() {
  try {
    await checkers.shortcutAcceptance(github.context.payload.number, GITHUB_TOKEN, CLUBHOUSE_TOKEN);
  } catch (error) {
    console.log(error.stack);
    core.setFailed(error.message);
  }
}

run();
