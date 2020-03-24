import React from 'react';

import JobPostingsPage from '../components/jobPostingsPage';
import withLocation from '../components/withLocation';

const JobPostings = (props) => {
  const { onsite, remote, intern, visa } = props.search;
  const filterFlags = { onsite, remote, intern, visa };

  return (
    <JobPostingsPage
      month={props.search.month || null}
      page={props.search.page}
      hitsPerPage={props.search.hitsPerPage}
      searchPattern={props.search.searchPattern}
      filterFlags={filterFlags}
      sort={props.search.sort}
    />
  );
};

export default withLocation(JobPostings);
