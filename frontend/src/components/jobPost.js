import React from 'react';
import { Card } from 'react-bootstrap';

const JobPost = ({ job }) => {
  const endOfTitle = job.body.indexOf('<p>');
  const title = job.body.substr(0, endOfTitle);
  const body = job.body.substr(endOfTitle);
  return (
    <Card className="job-posting">
      <Card.Body>
        <Card.Title>
          <div dangerouslySetInnerHTML={{ __html: title }}></div>
        </Card.Title>
        <Card.Text>
          <div dangerouslySetInnerHTML={{ __html: body }}></div>
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
