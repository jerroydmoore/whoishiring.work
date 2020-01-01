import React from 'react';

import JobPostingsPage from '../components/jobPostingsPage';

import { latestMonth } from '../services/jobPostings';

const IndexPage = () => <JobPostingsPage month={latestMonth} />;

export default IndexPage;
