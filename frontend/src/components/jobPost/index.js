import React from 'react';
import { Card } from 'react-bootstrap';
import BooleanUserAction from './BooleanUserAction';

import * as far from '@fortawesome/free-regular-svg-icons';
import { Markup } from 'interweave';

import { update as updateUserPost } from '../../services/userPost';

const JobPost = ({ job }) => {
  console.log('JobPost render ' + JSON.stringify(job.userPosts));

  const updateUserPostField = (field, value) => updateUserPost(job.id, field, value);

  return (
    <Card as="section" className="job-posting">
      <Card.Body className="post-actionbar">
        <BooleanUserAction
          field="applied"
          value={job.userPosts.applied}
          trueIcon={far.faCheckSquare}
          falseIcon={far.faSquare}
          trueLabel="Un-Mark as Applied"
          falseLabel="Mark as Applied"
          onClick={updateUserPostField}
        />
      </Card.Body>
      <Card.Body>
        <Card.Title>
          <Markup content={job.title} />
        </Card.Title>
        <Card.Text as="div">
          <Markup content={job.body} />
          <small className="authorship">
            Posted on{' '}
            <a
              title="View original post on Hacker News"
              href={`https://news.ycombinator.com/item?id=${job.id}`}
              rel="nofollow"
            >
              {job.postedDate.toLocaleString()}
            </a>{' '}
            by{' '}
            <a
              title="View author on Hacker News"
              href={`https://news.ycombinator.com/user?id=${job.author}`}
              rel="nofollow"
            >
              {job.author}
            </a>
          </small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default JobPost;
