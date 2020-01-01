import React from 'react';
import { Dropdown } from 'react-bootstrap';

const MonthPicker = ({ selected, jobCount, items, onChange }) => (
  <Dropdown size="lg">
    <Dropdown.Toggle className="active-month">
      {selected} {jobCount > 0 && <small>({jobCount} job postings)</small>}
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {items.map((item) => (
        <Dropdown.Item key={item} onClick={() => onChange(item)}>
          {item}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default MonthPicker;
