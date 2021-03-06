const ClubhouseLib = require("clubhouse-lib");

module.exports = class Clubhouse {
  constructor(token) {
    this.client = ClubhouseLib.create(token);
  }

  extractStoryIdFromPrTitle(title) {
    const chTag = title.match(/\[ch[0-9]+\]/g);
    const storyID = chTag ? chTag[0].replace(/\D/g, '') : null;

    return storyID;
  }

  async getStory(storyID) {
    const story = await this.client.getStory(storyID);

    return story;
  };

  storyHasLabel(story, labelText) {
    return story.labels.find((label) => label.name === labelText) !== undefined;
  }
}
