const Github = require("../../lib/github");
const Shortcut = require("../../lib/shortcut");
const Checkers = require("../../lib/checkers");
const { mockPr, mockStory } = require("./mocks.js");

jest.mock('../../lib/github');
jest.mock('../../lib/shortcut');

describe("shortcutAcceptance", () => {
  beforeEach(() => {
    Github.mockClear();
    Shortcut.mockClear();
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
      Checkers.shortcutAcceptance()
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

    expect(await Checkers.shortcutAcceptance("1")).toBeNull();

    expect(Github).toHaveBeenCalledTimes(1);
    expect(getPr).toHaveBeenCalledWith("1");
    expect(addPrStatus).toHaveBeenCalledWith({ description: "Can't find Shortcut story ID in PR title", state: "error", sha: "123", context: "Shortcut Acceptance", targetUrl: "https://app.shortcut.io/rotabull/stories" });
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

    Shortcut.mockImplementation(() => {
      return {
        getStory,
        extractStoryIdFromPrTitle: () => "123",
        storyHasLabel: () => false,
        storyHasType: () => false
      };
    });

    expect(await Checkers.shortcutAcceptance("1")).toBeNull();

    expect(Github).toHaveBeenCalledTimes(1);
    expect(getPr).toHaveBeenCalledWith("1");
    expect(getStory).toHaveBeenCalledWith("123");
    expect(addPrStatus).toHaveBeenCalledWith({ description: "Still waiting for acceptance", state: "pending", sha: "123", "context": "Shortcut Acceptance", targetUrl: undefined });
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

    Shortcut.mockImplementation(() => {
      return {
        getStory,
        extractStoryIdFromPrTitle: () => "123",
        storyHasLabel: () => true,
        storyHasType: () => false
      };
    });

    expect(await Checkers.shortcutAcceptance("1")).toBeNull();

    expect(Github).toHaveBeenCalledTimes(1);
    expect(getPr).toHaveBeenCalledWith("1");
    expect(getStory).toHaveBeenCalledWith("123");
    expect(addPrStatus).toHaveBeenCalledWith({ description: "Accepted", state: "success", sha: "123", "context": "Shortcut Acceptance", targetUrl: undefined });
  });

  it("add success pr status if CH story is a chore", async () => {
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

    Shortcut.mockImplementation(() => {
      return {
        getStory,
        extractStoryIdFromPrTitle: () => "123",
        storyHasType: () => true,
        storyHasLabel: () => false
      };
    });

    expect(await Checkers.shortcutAcceptance("1")).toBeNull();

    expect(Github).toHaveBeenCalledTimes(1);
    expect(getPr).toHaveBeenCalledWith("1");
    expect(getStory).toHaveBeenCalledWith("123");
    expect(addPrStatus).toHaveBeenCalledWith({ description: "Chores do not require Acceptance", state: "success", sha: "123", "context": "Shortcut Acceptance", targetUrl: undefined });
  });
});
