const Github = require("./github");
const Clubhouse = require("./clubhouse");
const githubStd = require("@actions/github");

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
  async repositoryDispatch(clubhouseId, githubToken) {
    const octokit = githubStd.getOctokit(githubToken);
    // const clubhouseId = context.payload.clientPayload["story_id"];

    console.log(encodeURIComponent(`fix in:title is:pr repo:rotabull/rotabull state:open`));

    const foundPrs = await octokit.search.issuesAndPullRequests(
      // { q: encodeURIComponent(`is:pr repo:rotabull/rotabull`) }
      { q: `[${clubhouseId}] is:pr+is:open+repo:rotabull/rotabull+draft:false` }
    )

    switch (foundPrs.data.items.length) {
      case 0:
        throw `No PRs found for Clubhouse ID: ${clubhouseId}`
      case 1:
      default:
        throw `Multiple PRs found for Clubhouse ID: ${clubhouseId}`
    }

    console.log(foundPrs);

    return foundPrs;
  }
};
