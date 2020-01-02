import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

import { getJobPostings, getMonths } from '../services/jobPostings';

import JobPost from './jobPost';
import Layout from '../components/layout';
import MonthPicker from '../components/monthPicker';
import Pagination from './pagination';
import PostPlaceholder from './postPlaceholder';
import SEO from '../components/seo';

const encodeUriParam = (param) => encodeURIComponent(param).replace(/%20/g, '+');
function gotoJobPostings(month, page = 1, hitsPerPage = 20) {
  navigate(`/jobPostings?month=${encodeUriParam(month)}&hitsPerPage=${hitsPerPage}&page=${page}`);
}

function validateOptionalDigitParam(value, defaultValue) {
  value = typeof value === 'undefined' ? defaultValue : value;
  if (value && /[1-9][0-9]*/.test(value)) {
    return parseInt(value, 10);
  }
}

const JobPostingsPage = ({ month, page, hitsPerPage }) => {
  console.log(`render JobPostingsPage(${month}, ${page}, ${hitsPerPage})`);
  page = validateOptionalDigitParam(page, 1);
  hitsPerPage = validateOptionalDigitParam(hitsPerPage, 20);

  const areParamsOk = page && hitsPerPage;

  const [errMsg, setErrMsg] = useState(areParamsOk ? null : 'Invalid parameters. Check your query string parameters.');
  const [monthList, setMonthList] = useState([]);
  const [jobPostings, setJobPostings] = useState(null);
  const [jobCount, setJobCount] = useState(0);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    if (!areParamsOk) {
      console.log('params are bad');
      return;
    }
    setJobPostings(null);
    setErrMsg(null);
    setJobCount(0);

    setTimeout(() => {
      // setTimeout allows the placeholders to render
      // while the large datasets render for large datasets.
      getJobPostings({ month, page, hitsPerPage })
        .then(({ posts, postsTotal, numberOfPages }) => {
          setJobPostings(posts);
          setJobCount(postsTotal);
          setMaxPage(numberOfPages);
        })
        .catch((err) => {
          console.error(err);
          setErrMsg(err.message);
        });
    }, 1);
  }, [areParamsOk, month, page, hitsPerPage]);
  useEffect(() => {
    getMonths()
      .then(setMonthList)
      .catch((err) => {
        console.error(err);
        setErrMsg(err.message);
      });
  }, []);

  const updatePage = (newPage) => {
    gotoJobPostings(month, newPage, hitsPerPage);
  };

  const pagination = !errMsg && jobPostings && jobPostings.length > 0 && (
    <Pagination active={page} max={maxPage} onChange={updatePage} />
  );

  return (
    <Layout>
      <SEO title={month} />
      <div className="postings-header">
        <MonthPicker selected={month} jobCount={jobCount} items={monthList} onChange={gotoJobPostings} />
        {pagination}
      </div>
      {errMsg && <div>Error: {errMsg}</div>}
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

      <div className="postings-footer">{pagination}</div>
    </Layout>
  );
};

export default JobPostingsPage;
