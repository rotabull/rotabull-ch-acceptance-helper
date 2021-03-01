const Github = require("../../lib/github");
const Clubhouse = require("../../lib/clubhouse");
const Checkers = require("../../lib/checkers");
const { mockPr, mockStory } = require("./mocks.js");

jest.mock('../../lib/github');
jest.mock('../../lib/clubhouse');

describe("clubhouseAcceptance", () => {
  beforeEach(() => {
    Github.mockClear();
    Clubhouse.mockClear();
  });

  it("forward the exception if Github throw", async () => {
    Github.mockImplementation(() => {
      return {
        getPr: () => {
          throw new Error("get pr fail");
        },
      };
    });

    await expect(
      Checkers.clubhouseAcceptance()
    ).rejects.toThrow("get pr fail");

    expect(Github).toHaveBeenCalledTimes(1);
  });

  it("add failure pr status if PR title does not includes CH story ID", async () => {
    const getPr = jest.fn(() => {
      return {
        data: mockPr
      }
    });

    const addPrStatus = jest.fn();

    Github.mockImplementation(() => {
      return {
        getPr,
        addPrStatus,
        getPrSha: () => (mockPr.sha)
      };
    });

    expect(await Checkers.clubhouseAcceptance("1")).toBeNull();

    expect(Github).toHaveBeenCalledTimes(1);
    expect(getPr).toHaveBeenCalledWith("1");
    expect(addPrStatus).toHaveBeenCalledWith({ description: "Can't find Clubhouse story ID in PR title", state: "error", sha: "123", context: "Clubhouse Acceptance", targetUrl: "https://app.clubhouse.io/rotabull/stories" });
  });

  it("add failure pr status if CH story does not includes the Accepted label", async () => {
    const getPr = jest.fn(() => {
      return {
        data: { ...mockPr, ...{ title: "title [ch123]" } }
      }
    });

    const addPrStatus = jest.fn();

    Github.mockImplementation(() => {
      return {
        getPr,
        addPrStatus,
        getPrSha: () => (mockPr.sha)
      };
    });

    const getStory = jest.fn(() => mockStory);

    Clubhouse.mockImplementation(() => {
      return {
        getStory,
        extractStoryIdFromPrTitle: () => "123",
        storyHasLabel: () => false
      };
    });

    expect(await Checkers.clubhouseAcceptance("1")).toBeNull();

    expect(Github).toHaveBeenCalledTimes(1);
    expect(getPr).toHaveBeenCalledWith("1");
    expect(getStory).toHaveBeenCalledWith("123");
    expect(addPrStatus).toHaveBeenCalledWith({ description: "Still waiting for acceptance", state: "pending", sha: "123", "context": "Clubhouse Acceptance", targetUrl: undefined });
  });

  it("add success pr status if CH story includes the Accepted label", async () => {
    const getPr = jest.fn(() => {
      return {
        data: { ...mockPr, ...{ title: "title [ch123]" } }
      }
    });

    const addPrStatus = jest.fn();

    Github.mockImplementation(() => {
      return {
        getPr,
        addPrStatus,
        getPrSha: () => (mockPr.sha)
      };
    });

    const getStory = jest.fn(() => mockStory);

    Clubhouse.mockImplementation(() => {
      return {
        getStory,
        extractStoryIdFromPrTitle: () => "123",
        storyHasLabel: () => true
      };
    });

    expect(await Checkers.clubhouseAcceptance("1")).toBeNull();

    expect(Github).toHaveBeenCalledTimes(1);
    expect(getPr).toHaveBeenCalledWith("1");
    expect(getStory).toHaveBeenCalledWith("123");
    expect(addPrStatus).toHaveBeenCalledWith({ description: "Accepted", state: "success", sha: "123", "context": "Clubhouse Acceptance", targetUrl: undefined });
  });
});
