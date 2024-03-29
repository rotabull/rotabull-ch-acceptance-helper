import { ShortcutClient } from '@useshortcut/client';

export default class Shortcut {
  constructor(token) {
    this.client = new ShortcutClient(token);
  }

  extractStoryIdFromPrTitle(title) {
    const chTag = title.match(/\[(sc-|ch)[0-9]+\]/g);
    const storyID = chTag ? chTag[0].replace(/\D/g, '') : null;

    return storyID;
  }

  async getStory(storyID) {
    const story_response = await this.client.getStory(storyID);
    return story_response.data;
  };

  storyHasLabel(story, labelText) {
    return story.labels.find((label) => label.name === labelText) !== undefined;
  }

  storyHasType(story, typeText) {
    return story.story_type === typeText;
  }
}
