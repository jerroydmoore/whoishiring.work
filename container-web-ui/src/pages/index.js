import React, { useState, useEffect } from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import JobPost from '../components/jobPost';
import MonthPicker from '../components/monthPicker';
import PostPlaceholder from '../components/postPlaceholder';

const API_URI = process.env.GATSBY_API_URI || 'http://localhost:8080';
if (!process.env.GATSBY_API_URI) {
  console.warn('GATSBY_API_URL is not set');
}

const IndexPage = () => {
  const [month, setMonth] = useState(null);
  const [monthList, setMonthList] = useState([]);
  const [jobCount, setJobCount] = useState(0);
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    fetch(`${API_URI}/v1/whoishiring/latest`)
      .then((response) => {
        return response.json();
      })
      .then(({ months, posts, postsTotal }) => {
        setMonth(months[0]);
        setMonthList(months);
        setJobCount(postsTotal);
        setJobPostings(posts);
        console.dir(posts);
      })
      .catch((err) => {
        console.log(`fetch error ${err}`);
      });
  }, []);
  const onMonthChange = (newMonth) => {
    setJobCount(0);
    setJobPostings([]);
    setMonth(newMonth);
    fetch(`${API_URI}/v1/whoishiring/months/${newMonth}/posts`)
      .then((response) => {
        return response.json();
      })
      .then(({ posts, postsTotal }) => {
        setJobCount(postsTotal);
        setJobPostings(posts);
      })
      .catch((err) => {
        console.log(`fetch error ${err}`);
      });
  };
  return (
    <Layout>
      <SEO title="Home" />
      {jobCount === 0 && <div className="month-picker-placeholder"> </div>}
      {jobCount > 0 && <MonthPicker selected={month} jobCount={jobCount} items={monthList} onChange={onMonthChange} />}

      {jobPostings.length === 0 && (
        <>
          <PostPlaceholder />
          <PostPlaceholder />
          <PostPlaceholder />
        </>
      )}

      {jobPostings.map((job) => (
        <JobPost job={job} />
      ))}
    </Layout>
  );
};

export default IndexPage;
