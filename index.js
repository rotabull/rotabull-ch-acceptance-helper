const fs = require("fs");
const core = require("@actions/core");
const checkers = require("./lib/checkers");

const GITHUB_TOKEN = core.getInput("github-token");
const CLUBHOUSE_TOKEN = core.getInput("clubhouse-token");

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));

async function run() {
  try {
    if (event.number) {
      await checkers.clubhouseAcceptance(event.number, GITHUB_TOKEN, CLUBHOUSE_TOKEN);
    }
  } catch (error) {
    console.log(error.stack);

    core.setFailed(error.message);
  }
}

run();
