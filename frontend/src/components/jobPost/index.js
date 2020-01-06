import React from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as far from '@fortawesome/free-regular-svg-icons';
import { Markup } from 'interweave';

import BooleanUserAction from './BooleanUserAction';

import { update as updateUserPost } from '../../services/userPost';

const JobPost = ({ job }) => {
  console.log('JobPost render ' + JSON.stringify(job.userPosts));

  const updateUserPostField = (field, value) => updateUserPost(job.id, field, value);
  const onNotesUpdate = ({ target }) => updateUserPost(job.id, 'notes', target.value);
  return (
    <Card as="section" className="job-posting">
      <Accordion defaultActiveKey={job.userPosts.notes && '0'}>
        <Card.Body className="post-actionbar">
          <Accordion.Toggle as={Button} variant="light" className="card-link" eventKey="0">
            <FontAwesomeIcon icon={far.faStickyNote} /> Notes
          </Accordion.Toggle>
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

        <Accordion.Collapse className="user-notes" eventKey="0">
          <Form.Control
            onChange={onNotesUpdate}
            defaultValue={job.userPosts.notes || ''}
            as="textarea"
            rows="3"
            placeholder="Type some notes here. Notes are automatically saved. Notes are private only to you."
          />
        </Accordion.Collapse>
      </Accordion>
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
