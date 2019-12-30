const whoIsHiringRegex = /^Ask HN: Who is hiring\?\s*\(([^)]+)\)\s*$/;

module.exports.story = function transformStory(story) {
  const res = whoIsHiringRegex.exec(story.title);
  const label = res[1];

  if (!label) {
    return;
  }

  return {
    id: parseInt(story.objectID, 10),
    label,
    postedDate: new Date(story.created_at),
  };
};

const remoteRegex = /\bremote\b/i;
const onsiteRegex = /\bon\s*site\b/i;
const internRegex = /\binterns?\b/i;
const visaRegex = /\bvisa\b/i;

module.exports.post = function transformPost(post) {
  const { author, comment_text: body, story_id: storyId, parent_id, created_at, objectID } = post;

  // only examine top level comments
  if (storyId !== parent_id) {
    return;
  }

  return {
    id: parseInt(objectID, 10),
    author,
    body,
    storyId,
    postedDate: new Date(created_at),
    remoteFlag: remoteRegex.test(body),
    onsiteFlag: onsiteRegex.test(body),
    internsFlag: internRegex.test(body),
    visaFlag: visaRegex.test(body),
  };
};
