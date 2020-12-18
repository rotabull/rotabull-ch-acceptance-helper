const ClubhouseLib = require("clubhouse-lib");
const Clubhouse = require("../../lib/clubhouse");

jest.mock('clubhouse-lib');

const mockStory = {
  labels: []
};

describe("extractStoryIdFromPrTitle", () => {
  it("return null if title is empty", () => {
    const clubhouse = new Clubhouse("token");

    expect(
      clubhouse.extractStoryIdFromPrTitle("")
    ).toBeNull();
  });

  it("return null if the title is not including ch tag", () => {
    const clubhouse = new Clubhouse("token");

    expect(
      clubhouse.extractStoryIdFromPrTitle("title")
    ).toBeNull();
  });

  it("return null if ch tag is not including the story id", () => {
    const clubhouse = new Clubhouse("token");

    expect(
      clubhouse.extractStoryIdFromPrTitle("title [ch]")
    ).toBeNull();
  });

  it("return null if ch tag is including non-numeric characters", () => {
    const clubhouse = new Clubhouse("token");

    expect(
      clubhouse.extractStoryIdFromPrTitle("title [ch123f]")
    ).toBeNull();
  });

  it("return null if ch tag is including story type", () => {
    const clubhouse = new Clubhouse("token");

    expect(
      clubhouse.extractStoryIdFromPrTitle("title [feature/ch123]")
    ).toBeNull();
  });

  it("properly extract story id if title is in the expected format", () => {
    const clubhouse = new Clubhouse("token");

    expect(
      clubhouse.extractStoryIdFromPrTitle("title [ch123]")
    ).toEqual("123");
  });
});

describe("storyHasAcceptedLabel", () => {
  it("return true if Accepted label is present", () => {
    const clubhouse = new Clubhouse("token");

    expect(
      clubhouse.storyHasAcceptedLabel({
        labels: [{name: "Accepted"}]
      })
    ).toBeTruthy();
  });

  it("return false if Accepted label is not present", () => {
    const clubhouse = new Clubhouse("token");

    expect(
      clubhouse.storyHasAcceptedLabel({
        labels: [{name: "Accept"}]
      })
    ).toBeFalsy();
  });
});

describe("getStory", () => {
  beforeEach(() => {
    ClubhouseLib.create.mockClear();
  });

  it("forward the exception if ClubhouseLib throw", async () => {
    ClubhouseLib.create.mockImplementation(() => {
      return {
        getStory: () => {
          throw new Error('fail');
        }
      };
    });

    const clubhouse = new Clubhouse("token");

    expect(ClubhouseLib.create).toHaveBeenCalledTimes(1);

    await expect(
      clubhouse.getStory("1")
    ).rejects.toThrow("fail");
  });

  it("make the correct request and forward its response", async () => {
    const getStory = jest.fn(() => mockStory);

    ClubhouseLib.create.mockImplementation(() => {
      return {
        getStory
      };
    });

    const clubhouse = new Clubhouse("token");

    expect(ClubhouseLib.create).toHaveBeenCalledTimes(1);

    const response = await clubhouse.getStory("1");

    expect(
      getStory
    ).toHaveBeenCalledWith("1");

    expect(response).toEqual(mockStory);
  });
});
