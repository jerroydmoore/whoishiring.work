import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

import { getJobPostings, getMonths } from '../services/jobPostings';

import FilterControls from './filterControls';
import JobPost from './jobPost';
import Layout from '../components/layout';
import MonthPicker from '../components/monthPicker';
import Pagination from './pagination';
import PostPlaceholder from './postPlaceholder';
import SEO from '../components/seo';

const defaultValue = {
  page: '1',
  hitsPerPage: '20',
  sort: 'postedDate',
};
const encodeUriParam = (param) => encodeURIComponent(param).replace(/%20/g, '+');
function gotoJobPostingsPage(month, params = '') {
  params = params.toString();
  if (params.length > 0) {
    params = '&' + params;
  }
  navigate(`/jobPostings/?month=${encodeUriParam(month)}${params}`);
}

function validateOptionalDigitParam(value, defaultValue) {
  value = typeof value === 'undefined' ? defaultValue : value;
  if (value && /[1-9][0-9]*/.test(value)) {
    return parseInt(value, 10);
  }
}
function validateStringOfList(value, list, defaultValue) {
  value = typeof value === 'undefined' ? defaultValue : value;
  if (list.includes(value)) {
    return value;
  }
}

const JobPostingsPage = ({
  month,
  page: initialPageValue,
  hitsPerPage: initialHitsPerPage,
  sort: initialSortValue,
  filterFlags,
  searchPattern,
}) => {
  filterFlags = filterFlags || {};
  function updateJobPostingsPage(opts) {
    opts = {
      page: initialPageValue,
      hitsPerPage: initialHitsPerPage,
      sort: initialSortValue,
      ...filterFlags,
      searchPattern,
      ...opts,
    };
    delete opts.months;
    for (const [name, value] of Object.entries(opts)) {
      if (typeof value === 'undefined' || value === defaultValue[name]) {
        delete opts[name];
      }
    }
    if (opts.page && !opts.hitsPerPage) {
      opts.hitsPerPage = defaultValue.hitsPerPage; // always include hitsPerPage when page is present
    }
    gotoJobPostingsPage(month, new URLSearchParams(opts));
  }
  console.log(
    `render JobPostingsPage(${JSON.stringify({
      month,
      page: initialPageValue,
      searchPattern,
      sort: initialSortValue,
      filterFlags,
    })})`
  );

  const page = validateOptionalDigitParam(initialPageValue, defaultValue.page);
  const hitsPerPage = validateOptionalDigitParam(initialHitsPerPage, defaultValue.hitsPerPage);
  const sort = validateStringOfList(
    initialSortValue,
    ['postedDate', '-postedDate', 'title', '-title'],
    defaultValue.sort
  );

  const areParamsOk = page && hitsPerPage && sort;

  const [errMsg, setErrMsg] = useState(areParamsOk ? null : 'Invalid parameters. Check your query string parameters.');
  const [monthList, setMonthList] = useState([]);
  const [jobPostings, setJobPostings] = useState(null);
  const [jobCount, setJobCount] = useState(0);
  const [maxPage, setMaxPage] = useState(1);

  // useEffect's second arg cannot accept Objects
  const { onsite, remote, intern, visa } = filterFlags;

  useEffect(() => {
    const filterFlags = { onsite, remote, intern, visa };
    console.log(
      `Update jobs: ${JSON.stringify({ areParamsOk, month, page, hitsPerPage, searchPattern, filterFlags, sort })}`
    );
    if (!areParamsOk) {
      console.warn('params are bad');
      return;
    }
    setJobPostings(null);
    setErrMsg(null);
    setJobCount(0);

    setTimeout(() => {
      // setTimeout allows the placeholders to render
      // while the large datasets render for large datasets.
      getJobPostings({ month, page, hitsPerPage, searchPattern, filterFlags, sort })
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
  }, [areParamsOk, month, page, hitsPerPage, searchPattern, onsite, remote, intern, visa, sort]);
  useEffect(() => {
    getMonths()
      .then(setMonthList)
      .catch((err) => {
        console.error(err);
        setErrMsg(err.message);
      });
  }, []);

  const gotoPage = (page) => {
    updateJobPostingsPage({ page, hitsPerPage: hitsPerPage });
  };

  const pagination = !errMsg && jobPostings && jobPostings.length > 0 && (
    <Pagination active={page} max={maxPage} onChange={gotoPage} />
  );

  const onFilterChange = (field, value) => {
    if (value === '') {
      value = undefined;
    }
    // when filters change, reset the user back to the first page.
    updateJobPostingsPage({ [field]: value, page: undefined });
  };

  return (
    <Layout>
      <SEO title={month} />

      <FilterControls onChange={onFilterChange} searchPattern={searchPattern} filterFlags={filterFlags} sort={sort} />
      <div className="postings-header">
        <MonthPicker selected={month} jobCount={jobCount} items={monthList} onChange={gotoJobPostingsPage} />
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
