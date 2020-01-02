import fetch from 'node-fetch';

const API_URI = process.env.GATSBY_API_URI || 'http://localhost:8080';
if (!process.env.GATSBY_API_URI) {
  console.warn('GATSBY_API_URL is not set');
}

export const latestMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

let months = [];
const jobPostings = new Map();

const getLatest = fetch(`${API_URI}/v1/whoishiring/latest`)
  .then((response) => {
    return response.json();
  })
  .then((results) => {
    months = results.months;
    delete results.months;
    jobPostings.set(months[0], getLatest);

    if (months[0] !== latestMonth) {
      months.unshift(latestMonth);
    }
    return results;
  })
  .catch((err) => {
    console.log(`fetch error ${err}`);
  });

async function _getJobPostings(month) {
  try {
    const response = await fetch(`${API_URI}/v1/whoishiring/months/${month}/posts`);
    if (response.ok) {
      const body = await response.json();
      return body;
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
export async function getJobPostings({ month, page, hitsPerPage }) {
  if (page < 1) {
    throw new Error('invalid page value');
  }
  if (hitsPerPage < 20) {
    throw new Error('invalid hitsPerPage value. minimum value is 20.');
  }

  // TODO month format validation

  await getLatest;
  let promise;
  if (jobPostings.has(month)) {
    promise = jobPostings.get(month);
  } else {
    promise = _getJobPostings(month);
    jobPostings.set(month, promise);
  }
  const { posts, postsTotal } = await promise;
  const numberOfPages = Math.ceil(postsTotal / hitsPerPage);

  const start = (page - 1) * hitsPerPage;

  return {
    posts: posts.slice(start, start + hitsPerPage),
    postsTotal,
    numberOfPages,
    hitsPerPage,
  };
}
