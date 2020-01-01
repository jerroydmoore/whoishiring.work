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
export async function getJobPostings(month) {
  // TODO month format validation
  await getLatest;
  if (jobPostings.has(month)) {
    return await jobPostings.get(month);
  } else {
    const promise = _getJobPostings(month);
    jobPostings.set(month, promise);
    return await promise;
  }
}
