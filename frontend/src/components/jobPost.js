import React from 'react';
import { Card } from 'react-bootstrap';
import { Markup } from 'interweave';

const JobPost = ({ job }) => {
  return (
    <Card className="job-posting">
      <Card.Body>
        <Card.Title>
          <Markup content={job.title} />
        </Card.Title>
        <Card.Text>
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
