const { Octokit } = require("@octokit/core");
const github = require('@actions/github');

module.exports = class Github {
  constructor(token) {
    this.client = new Octokit({ auth: token });
  }

  getPrSha(pr) {
    const href = pr.statuses_url.split("/");

    return href[href.length - 1];
  }

  async getPr(prNumber) {
    const pr = await this.client.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber,
    });

    return pr;
  };

  async addPrStatus({ sha, state, description, context, targetUrl }) {
    const status = await this.client.request('POST /repos/{owner}/{repo}/statuses/{sha}', {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha,
      description,
      state,
      context,
      target_url: targetUrl
    });

    return status;
  };
}
