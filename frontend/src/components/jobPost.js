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
        {/* <Card.Text>

      </Card.Text> */}
        <Card.Text>
          <div dangerouslySetInnerHTML={{ __html: body }}></div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default JobPost;
