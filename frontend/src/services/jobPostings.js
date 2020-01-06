import fetch from 'node-fetch';
import * as userPostService from './userPost';

const API_URI = process.env.GATSBY_API_URI || 'http://localhost:8080';
if (!process.env.GATSBY_API_URI) {
  console.warn('GATSBY_API_URL is not set');
}

export const latestMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

let months = [];
const jobPostings = new Map();

async function transformJobPostingsBody({ posts, postTotal }) {
  posts = await Promise.all(posts.map(transformPost));
  return { posts, postTotal };
}

async function transformPost(post) {
  post.postedDate = new Date(post.postedDate);
  let endOfTitle = post.body.indexOf('<p>');
  if (endOfTitle < 0) {
    endOfTitle = post.body.length; // body is simply one line
  }
  post._body = post.body;
  post.title = post.body.substr(0, endOfTitle);
  post.body = post.body.substr(endOfTitle);

  const userPosts = await userPostService.findOrCreate(post.id);

  return { userPosts, ...post };
}

const filterRegex = {
  onsite: /\bon\s*site\b/i,
  remote: /\bremote\b/i,
  intern: /\binterns?\b/i,
  visa: /\bvisa\b/i,
};
function filterPosts(filterFlags, searchPattern) {
  const searchRegex = searchPattern && new RegExp(searchPattern);
  return (post) => {
    for (const [name, isFilterOn] of Object.entries(filterFlags)) {
      if (isFilterOn && !filterRegex[name].test(post._body)) {
        return false;
      }
      if (searchRegex && !searchRegex.test(post._body)) {
        return false;
      }
    }
    return true;
  };
}

const getLatest = fetch(`${API_URI}/v1/whoishiring/latest`)
  .then((response) => {
    return response.json();
  })
  .then((results) => {
    months = results.months;
    jobPostings.set(months[0], getLatest);

    if (months[0] !== latestMonth) {
      months.unshift(latestMonth);
    }

    return transformJobPostingsBody(results);
  })
  .catch((err) => {
    console.log(`fetch error ${err}`);
  });

async function _getJobPostings(month) {
  try {
    const response = await fetch(`${API_URI}/v1/whoishiring/months/${month}/posts`);
    if (response.ok) {
      const body = await response.json();
      return transformJobPostingsBody(body);
    }
    console.error(`fetch ${month} failed. status: ${response.status}. ${response.text}`);

    return { posts: [], postTotal: 0 };
  } catch (err) {
    console.log(`fetch ${month} err: ${err}`);
    throw err;
  }
}

export async function getMonths() {
  await getLatest;
  return months;
}

// TODO save this to the db
export async function updateUserJobPostField(month, postId, field, value) {
  if (!jobPostings.has(month)) {
    console.error(`updateUserJobPostField err: no posts for month ${months}`);
    return false;
  }

  const { posts } = await jobPostings.get(month);
  const post = posts.find((post) => post.id === postId);
  if (!post) {
    console.error(`updateUserJobPostField err: no posts for id ${postId}`);
    return false;
  }
  await randomWait();
  console.log(`updated ${postId}`);
  post.userPosts[field] = value;
  return true;
}
const randomWait = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1000)));

const monthRegex = /^(January|Feburary|March|April|May|June|July|August|September|October|November|December) 20\d\d$/;
export async function getJobPostings({ month, page, hitsPerPage, sort, searchPattern, filterFlags }) {
  if (page < 1) {
    throw new Error('invalid page value');
  }
  if (hitsPerPage < 20) {
    throw new Error('invalid hitsPerPage value. minimum value is 20.');
  }
  if (!monthRegex.test(month)) {
    throw new Error(`${month} is not a valid month.`);
  }

  await getLatest;
  let promise;
  if (jobPostings.has(month)) {
    promise = jobPostings.get(month);
  } else {
    promise = _getJobPostings(month);
    jobPostings.set(month, promise);
  }
  let { posts, postsTotal } = await promise;

  const start = (page - 1) * hitsPerPage;

  const descending = sort[0] === '-';
  if (descending) {
    sort = sort.substr(1);
  }
  posts.sort((a, b) => {
    a = a[sort];
    b = b[sort];

    if (typeof a === 'string') {
      return a.localeCompare(b, { sensitivity: 'base', ignorePunctuation: true });
    } else if (typeof a === 'number' || a instanceof Date) {
      return a - b;
    } else {
      throw new Error(`${typeof a} is unsortable`);
    }
  });
  if (descending) {
    posts.reverse();
  }
  posts = posts.filter(filterPosts(filterFlags, searchPattern));
  const numberOfPages = Math.ceil(posts.length / hitsPerPage);
  console.log(`search result count: ${posts.length}`);

  return {
    posts: posts.slice(start, start + hitsPerPage),
    postsTotal,
    numberOfPages,
    hitsPerPage,
  };
}
