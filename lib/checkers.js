const Github = require("./github");
const Clubhouse = require("./clubhouse");

const CONTEXT = "Clubhouse Acceptance"
const DEFAULT_URL = "https://app.clubhouse.io/rotabull/stories"

module.exports = {
  async clubhouseAcceptance(prNumber, githubToken, clubhouseToken) {
    const github = new Github(githubToken);
    const clubhouse = new Clubhouse(clubhouseToken);

    const { data: pr } = await github.getPr(prNumber);

    const sha = github.getPrSha(pr);
    const storyID = clubhouse.extractStoryIdFromPrTitle(pr.title);

    if (!storyID) {
      await github.addPrStatus({ description: "Can't find Clubhouse story ID in PR title", state: "failure", sha, context: CONTEXT, targetUrl: DEFAULT_URL });

      return null;
    }

    const story = await clubhouse.getStory(storyID);

    if (!clubhouse.storyHasAcceptedLabel(story)) {
      await github.addPrStatus({ description: "Not accepted yet", state: "failure", sha, context: CONTEXT, targetUrl: story.app_url });
    } else {
      await github.addPrStatus({ description: "Accepted", state: "success", sha, context: CONTEXT, targetUrl: story.app_url });
    }

    return null;
  },
};
