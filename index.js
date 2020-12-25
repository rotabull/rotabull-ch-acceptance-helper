import fs from "fs";
import core from "@actions/core";
import checkers from "./lib/checkers";
import { context } from "@actions/github";

const GITHUB_TOKEN = core.getInput("github-token");
const CLUBHOUSE_TOKEN = core.getInput("clubhouse-token");

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));

async function run() {
  try {
    console.log(context.eventName)
    await checkers.clubhouseAcceptance(event.number, GITHUB_TOKEN, CLUBHOUSE_TOKEN);

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
