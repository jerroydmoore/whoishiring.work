import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

import { getJobPostings, getMonths } from '../services/jobPostings';

import JobPost from './jobPost';
import Layout from '../components/layout';
import MonthPicker from '../components/monthPicker';
import PostPlaceholder from './postPlaceholder';
import SEO from '../components/seo';

const navigateToMonth = (month) => {
  navigate(`/jobPostings?month=${month}`);
};

const JobPostingsPage = (props) => {
  const month = props.month;
  const [errMsg, setErrMsg] = useState(null);
  const [monthList, setMonthList] = useState([]);
  const [jobPostings, setJobPostings] = useState(null);
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    setJobPostings(null);
    setErrMsg(null);
    setJobCount(0);

    setTimeout(() => {
      // setTimeout allows the placeholders to render
      // while the large datasets render for large datasets.
      getJobPostings(month)
        .then(({ posts, postsTotal }) => {
          setJobPostings(posts);
          setJobCount(postsTotal);
        })
        .catch((err) => {
          console.error(err);
          setErrMsg(err.message);
        });
    }, 1);
  }, [month]);
  useEffect(() => {
    getMonths()
      .then(setMonthList)
      .catch((err) => {
        console.error(err);
        setErrMsg(err.message);
      });
  }, []);

  return (
    <Layout>
      <SEO title={month} />
      <MonthPicker selected={month} jobCount={jobCount} items={monthList} onChange={navigateToMonth} />
      {errMsg && <div>Error: ${errMsg}</div>}
      {!errMsg && !jobPostings && (
        <>
          <PostPlaceholder />
          <PostPlaceholder />
          <PostPlaceholder />
        </>
      )}
      {jobPostings && jobPostings.length === 0 && (
        <div>
          Jobs are not available for this month. Try picking a different month. Jobs are typically posted on the first
          of each month approximately 11AM PST.
        </div>
      )}
      {jobPostings && jobPostings.length > 0 && jobPostings.map((job) => <JobPost key={job.id} job={job} />)}
    </Layout>
  );
};

export default JobPostingsPage;
