const debug = require('debug')('app');
const api = require('./hackerNewsApi');
const transform = require('./transform');
const { stories, posts, sequelize } = require('./models');

const HOWMANY_STORIES = parseInt(process.env.HOWMANY_STORIES, 10) || 1;

async function loadStory(story) {
  const [, isNewStory] = await stories.findOrCreate({
    where: { id: story.id },
    defaults: story,
  });

  const newStoryCount = isNewStory ? 1 : 0;
  const promises = [];
  let totalPostCount = 0;
  let newPostCount = 0;
  for await (const data of api.getPostsByStoryIds(story.id)) {
    const post = transform.post(data);
    if (post !== undefined) {
      const p = posts
        .findOrCreate({
          where: { id: post.id },
          defaults: post,
        })
        // eslint-disable-next-line no-loop-func
        .then(([, isNewPost]) => {
          debug(
            'post(%d, new=%s): %s...',
            ++totalPostCount,
            isNewPost,
            post.body.substr(0, 80).replace(/(?:\r\n|\r|\n)/g, ' ')
          );
          if (isNewPost) {
            newPostCount++;
          }
        });

      promises.push(p);
    }
  }
  await Promise.all(promises);
  return [totalPostCount, newPostCount, newStoryCount];
}

async function main() {
  try {
    let totalStoryCount = 0;
    const promises = [];

    for await (const data of api.getWhoIsHiringStories()) {
      debug(`story: ${data.title} (ID: ${data.objectID})`);
      const story = transform.story(data);
      if (story !== undefined) {
        // validate story, then insert post
        promises.push(loadStory(story));

        if (++totalStoryCount >= HOWMANY_STORIES) {
          break;
        }
      }
    }

    debug('Waiting for tasks to complete...');
    const results = await Promise.all(promises);
    const [totalPostCount, newPostCount, newStoryCount] = results.reduce(
      (total, current) => {
        total[0] += current[0];
        total[1] += current[1];
        total[2] += current[2];
        return total;
      },
      [0, 0, 0]
    );

    console.log(`story count (new/total): ${newStoryCount}/${totalStoryCount}`);
    console.log(`post  count (new/total): ${newPostCount}/${totalPostCount}`);
    debug('Done!');
  } catch (err) {
    console.error(`MAIN ERR ${err}`);
    process.exit(1);
  } finally {
    sequelize.close();
  }
}

main();
