import React, { useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, FormControl, FormGroup, Row } from 'react-bootstrap';

const DESC = '↗';
const ASC = '↘';

const FilterControls = ({ onChange, searchPattern: initialSearchPattern, sort, filterFlags }) => {
  const [searchPattern, setSearchPattern] = useState(initialSearchPattern);

  let isDesc = sort && sort[0] === '-';
  sort = !isDesc ? sort : sort.substr(1);

  function updateFromFromControl(setter) {
    return ({ target }) => {
      const value = target.type === 'checkbox' ? target.checked : target.value;
      setter(value);
    };
  }

  const onFilterClick = (field) => {
    if (filterFlags[field]) {
      onChange(field, undefined);
    } else {
      onChange(field, 'y');
    }
  };
  const filterCheckboxGroup = [
    { label: 'On-Site', field: 'onsite' },
    { label: 'Remote', field: 'remote' },
    { label: 'Internships available', field: 'intern' },
    { label: 'Visa', field: 'visa' },
    // TODO add more checkboxes to sort by
  ].map(({ label, field }) => {
    return (
      <Form.Check
        type="checkbox"
        key={field}
        label={label}
        id={`${field}FilterCheckbox`}
        checked={filterFlags[field]}
        onChange={() => onFilterClick(field)}
        inline
      />
    );
  });

  const onSortClick = (field) => {
    isDesc = sort === field ? !isDesc : false;
    onChange('sort', (isDesc ? '-' : '') + field);
  };
  const sortingButtons = [
    { label: 'Posted Date', field: 'postedDate' },
    { label: 'Company', field: 'title' },
    // TODO add more fields to sort by
  ].map(({ label, field }) => {
    const selected = field === sort;
    const variant = selected ? 'primary' : 'light';
    const order = selected && isDesc ? DESC : ASC;
    return (
      <Button key={field} variant={variant} size="sm" onClick={() => onSortClick(field)}>
        {label} {order}
      </Button>
    );
  });

  const handleSubmit = (event) => {
    try {
      if (initialSearchPattern !== searchPattern) {
        onChange('searchPattern', searchPattern);
      }
    } catch (err) {
      console.error(`filterControl submit error: ${err}`);
    }
    event.preventDefault();
    return false;
  };

  return (
    <Container>
      <Card className="filter-controls">
        <Card.Body>
          <h5>Advanced Search:</h5>
          <form onSubmit={handleSubmit}>
            <FormGroup as={Row}>
              <Form.Label column xs={12} sm={3} md={2} id="searchTitleLabel">
                Search:
              </Form.Label>
              <Col xs={12} sm={9} md={10}>
                <FormControl
                  placeholder='Use regular expessions to search among posts, e.g. "(sf|san francisco)"'
                  aria-describedby="searchTitleLabel"
                  value={searchPattern}
                  onChange={updateFromFromControl(setSearchPattern)}
                  onBlur={() => onChange('searchPattern', searchPattern)}
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Form.Label column xs={12} sm={3} md={2} id="filterLabel">
                Filters:
              </Form.Label>
              <Col xs={12} sm={9} md={10}>
                {filterCheckboxGroup}
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Form.Label column xs={12} sm={3} md={2} id="sortLabel">
                Sort:
              </Form.Label>
              <Col xs={12} sm={9} md={10}>
                <ButtonGroup aria-label="sort job postings">{sortingButtons}</ButtonGroup>
              </Col>
            </FormGroup>
            <input type="submit" style={{ display: 'none' }} />
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FilterControls;
