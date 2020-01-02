import React from 'react';

import JobPostingsPage from '../components/jobPostingsPage';
import withLocation from '../components/withLocation';

const JobPostings = (props) => (
  <JobPostingsPage month={props.search.month} page={props.search.page} hitsPerPage={props.search.hitsPerPage} />
);

export default withLocation(JobPostings);
