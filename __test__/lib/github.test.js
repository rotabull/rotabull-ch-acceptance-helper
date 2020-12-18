const { Octokit } = require("@octokit/core");
const Github = require("../../lib/github");

jest.mock('@octokit/core');

const mockPr = {
  number: "1"
};

describe("getPr", () => {
  beforeEach(() => {
    Octokit.mockClear();
  });

  it("forward the exception if Octokit throw", async () => {
    Octokit.mockImplementation(() => {
      return {
        request: () => {
          throw new Error('fail');
        },
      };
    });

    const github = new Github("token");

    expect(Octokit).toHaveBeenCalledTimes(1);

    await expect(
      github.getPr("1")
    ).rejects.toThrow("fail");
  });

  it("make the correct request and forward its response", async () => {
    const request = jest.fn(() => mockPr);

    Octokit.mockImplementation(() => {
      return {
        request: request
      };
    });

    const github = new Github("token");

    expect(Octokit).toHaveBeenCalledTimes(1);

    const response = await github.getPr("1");

    expect(
      request
    ).toHaveBeenCalledWith("GET /repos/{owner}/{repo}/pulls/{pull_number}", {"owner": "rotabull", "pull_number": "1", "repo": "rotabull"});

    expect(response).toEqual(mockPr);
  });
});

describe("addPrStatus", () => {
  beforeEach(() => {
    Octokit.mockClear();
  });

  it("forward the exception if Octokit throw", async () => {
    Octokit.mockImplementation(() => {
      return {
        request: () => {
          throw new Error('fail');
        },
      };
    });

    const github = new Github("token");

    expect(Octokit).toHaveBeenCalledTimes(1);

    await expect(
      github.addPrStatus({sha: "", state: "", description: ""})
    ).rejects.toThrow("fail");
  });

  it("make the correct request and forward its response", async () => {
    const request = jest.fn(() => ({}));

    Octokit.mockImplementation(() => {
      return {
        request: request
      };
    });

    const github = new Github("token");

    expect(Octokit).toHaveBeenCalledTimes(1);

    const response = await github.addPrStatus({sha: "sha", state: "state", description: "description"});

    expect(
      request
    ).toHaveBeenCalledWith("POST /repos/{owner}/{repo}/statuses/{sha}", {
      "description": "description",
      "owner": "rotabull",
      "repo": "rotabull",
      "sha": "sha",
      "state": "state",
   });

    expect(response).toEqual({});
  });
});
