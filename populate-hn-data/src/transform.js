const whoIsHiringRegex = /^Ask HN: Who is hiring\?\s*\(([^)]+)\)\s*$/;

module.exports.story = function transformStory(story) {
  const postedDate = new Date(story.created_at);
  let label;
  const res = whoIsHiringRegex.exec(story.title);

  if (res && res[1]) {
    label = res[1];
  } else if (story.objectID === '22665398') {
    // COVID-19 triggered a global economic downturn causing layoffs
    // An out-of-cycle Who is hiring post was created
    label = 'March 2020 for COVID-19';
  } else {
    // Catch other bad formatted posts and analyze later
    // Avoid duplicate labels by appending the ID
    label = `${[postedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })]} (ID: ${story.objectID})`;
    console.warn(`transform story: Malformed title "${story.title}" (ID: ${story.objectID}). Label set to "${label}".`);
  }

  return {
    id: parseInt(story.objectID, 10),
    label,
    postedDate,
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
