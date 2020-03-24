const debug = require('debug')('app:hn-api');
const { URL } = require('url');
const fetch = require('node-fetch');

const HACKERNEWS_API_URL = 'http://hn.algolia.com/api/v1/search_by_date';
const whoIsHiringRegex = /^Ask HN: Who is hiring\?/;

module.exports = {
  async *getItems(params, hitsPerPage = 100, page = 0) {
    const url = new URL(HACKERNEWS_API_URL);
    url.searchParams.set('hitsPerPage', hitsPerPage);

    for (const key of Object.keys(params)) {
      url.searchParams.set(key, params[key]);
    }

    let yieldCount = 0;
    let max = -1;

    do {
      url.searchParams.set('page', page++);

      debug(`getItems ${url.href}`);
      const response = await fetch(url.href);
      const body = await response.json();

      max = body.nbHits;
      if (body.hits.length === 0) {
        debug('0 hits returned');
        return;
      }

      yield* body.hits;
      yieldCount += body.hits.length;

      debug(`page set exhausted. Refresh? ${yieldCount} < ${max}`);
    } while (yieldCount < max);
    debug('getItems exhausted');
  },
  async *getStoriesByAuthor(author, hitsPerPage = 100) {
    const params = { tags: `author_${author},(story,poll)` };
    for await (const item of this.getItems(params, hitsPerPage)) {
      yield item;
    }
  },

  async *getWhoIsHiringStories() {
    for await (const item of this.getStoriesByAuthor('whoishiring')) {
      if (whoIsHiringRegex.test(item.title)) {
        yield item;
      } else {
        debug(`getWhoIsHiringStories: skipping topic "${item.title}" (ID: ${item.objectID})`);
      }
    }
  },
  async *getPostsByStoryIds(storyIds) {
    if (!Array.isArray(storyIds)) {
      storyIds = [storyIds];
    }
    const params = { tags: `comment,(${storyIds.map((id) => `story_${id}`).join(',')})` };
    for await (const item of this.getItems(params, 1000)) {
      yield item;
    }
  },
};
