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
      await github.addPrStatus({ description: "Can't find Clubhouse story ID in PR title", state: "error", sha, context: CONTEXT, targetUrl: DEFAULT_URL });

      return null;
    }

    const story = await clubhouse.getStory(storyID);

    if(clubhouse.storyHasType(story,"chore")){
      await github.addPrStatus({ description: "Chores do not require Acceptance", state: "success", sha, context: CONTEXT, targetUrl: story.app_url });
    }else if (clubhouse.storyHasLabel(story, "Accepted")) {
      await github.addPrStatus({ description: "Accepted", state: "success", sha, context: CONTEXT, targetUrl: story.app_url });
    }
     else if (clubhouse.storyHasLabel(story, "Not Accepted")) {
      await github.addPrStatus({ description: "Not Accepted", state: "failure", sha, context: CONTEXT, targetUrl: story.app_url });
    }
     else {
      await github.addPrStatus({ description: "Still waiting for acceptance", state: "pending", sha, context: CONTEXT, targetUrl: story.app_url });
    }

    return null;
  },
};
