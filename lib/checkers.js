const Github = require("./github");
const Shortcut = require("./shortcut");

const CONTEXT = "Shortcut Acceptance"
const DEFAULT_URL = "https://app.shortcut.com/rotabull/stories"

module.exports = {
  async shortcutAcceptance(prNumber, githubToken, shortcutToken) {
    const github = new Github(githubToken);
    const shortcut = new Shortcut(shortcutToken);

    const { data: pr } = await github.getPr(prNumber);

    const sha = github.getPrSha(pr);
    const storyID = shortcut.extractStoryIdFromPrTitle(pr.title);

    if (!storyID) {
      await github.addPrStatus({ description: "Can't find Shortcut story ID in PR title", state: "error", sha, context: CONTEXT, targetUrl: DEFAULT_URL });

      return null;
    }

    const story = await shortcut.getStory(storyID);

    if (shortcut.storyHasType(story, "chore")) {
      await github.addPrStatus({ description: "Chores do not require Acceptance", state: "success", sha, context: CONTEXT, targetUrl: story.app_url });
    } else if (shortcut.storyHasLabel(story, "Accepted")) {
      await github.addPrStatus({ description: "Accepted", state: "success", sha, context: CONTEXT, targetUrl: story.app_url });
    }
    else if (shortcut.storyHasLabel(story, "Not Accepted")) {
      await github.addPrStatus({ description: "Not Accepted", state: "failure", sha, context: CONTEXT, targetUrl: story.app_url });
    }
    else {
      await github.addPrStatus({ description: "Still waiting for acceptance", state: "pending", sha, context: CONTEXT, targetUrl: story.app_url });
    }

    return null;
  },
};
