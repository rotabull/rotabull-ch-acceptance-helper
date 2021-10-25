const ShortcutLib = require("shortcut-lib");
const Shortcut = require("../../lib/shortcut");
const { mockStory } = require("./mocks");

jest.mock('shortcut-lib');

describe("extractStoryIdFromPrTitle", () => {
  it("return null if title is empty", () => {
    const shortcut = new Shortcut("token");

    expect(
      shortcut.extractStoryIdFromPrTitle("")
    ).toBeNull();
  });

  it("return null if the title is not including ch tag", () => {
    const shortcut = new Shortcut("token");

    expect(
      shortcut.extractStoryIdFromPrTitle("title")
    ).toBeNull();
  });

  it("return null if ch tag is not including the story id", () => {
    const shortcut = new Shortcut("token");

    expect(
      shortcut.extractStoryIdFromPrTitle("title [ch]")
    ).toBeNull();
  });

  it("return null if ch tag is including non-numeric characters", () => {
    const shortcut = new Shortcut("token");

    expect(
      shortcut.extractStoryIdFromPrTitle("title [ch123f]")
    ).toBeNull();
  });

  it("return null if ch tag is including story type", () => {
    const shortcut = new Shortcut("token");

    expect(
      shortcut.extractStoryIdFromPrTitle("title [feature/ch123]")
    ).toBeNull();
  });

  it("properly extract story id if title is in the expected format", () => {
    const shortcut = new Shortcut("token");

    expect(
      shortcut.extractStoryIdFromPrTitle("title [ch123]")
    ).toEqual("123");
  });
});

describe("storyHasLabel", () => {
  it("return true if Accepted label is present", () => {
    const shortcut = new Shortcut("token");

    expect(
      shortcut.storyHasLabel({
        labels: [{ name: "Accepted" }]
      }, "Accepted")
    ).toBeTruthy();
  });

  it("return false if Accepted label is not present", () => {
    const shortcut = new Shortcut("token");

    expect(
      shortcut.storyHasLabel({
        labels: [{ name: "Accept" }]
      }, "Accepted")
    ).toBeFalsy();
  });
});

describe("getStory", () => {
  beforeEach(() => {
    ShortcutLib.create.mockClear();
  });

  it("forward the exception if ShortcutLib throw", async () => {
    ShortcutLib.create.mockImplementation(() => {
      return {
        getStory: () => {
          throw new Error('fail');
        }
      };
    });

    const shortcut = new Shortcut("token");

    expect(ShortcutLib.create).toHaveBeenCalledTimes(1);

    await expect(
      shortcut.getStory("1")
    ).rejects.toThrow("fail");
  });

  it("make the correct request and forward its response", async () => {
    const getStory = jest.fn(() => mockStory);

    ShortcutLib.create.mockImplementation(() => {
      return {
        getStory
      };
    });

    const shortcut = new Shortcut("token");

    expect(ShortcutLib.create).toHaveBeenCalledTimes(1);

    const response = await shortcut.getStory("1");

    expect(
      getStory
    ).toHaveBeenCalledWith("1");

    expect(response).toEqual(mockStory);
  });
});
