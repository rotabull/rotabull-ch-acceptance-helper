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
    console.log(github.context.payload.repository);
    const pr = await this.client.request('GET /repos/{repo}/pulls/{pull_number}', {
      repo: github.context.payload.repository,
      pull_number: prNumber,
    });

    return pr;
  };

  async addPrStatus({ sha, state, description, context, targetUrl }) {
    const status = await this.client.request('POST /repos/{repo}/statuses/{sha}', {
      repo: github.context.payload.repository,
      sha,
      description,
      state,
      context,
      target_url: targetUrl
    });

    return status;
  };
}
