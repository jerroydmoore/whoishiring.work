import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const digitRegex = /^\d*$/;

const Pagination = ({ active, max, onChange }) => {
  const [value, setValue] = useState(active);
  if (max === 1) {
    return null;
  }
  const changeBy = (delta) => {
    return () => {
      onChange(active + delta);
    };
  };
  const onInput = (event) => {
    if (digitRegex.test(event.target.value)) {
      setValue(event.target.value);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedValue = parseInt(value, 10);
    if (parsedValue > 0 && parsedValue <= max && parsedValue !== active) {
      onChange(parsedValue);
    }
    return false;
  };
  return (
    <div className="pagination-control">
      <form onSubmit={handleSubmit}>
        {active !== 1 && (
          <Button variant="link" onClick={changeBy(-1)}>
            &laquo;
          </Button>
        )}
        Page: <input type="text" size="2" value={value} onChange={onInput} /> of {max}
        {active !== max && (
          <Button variant="link" onClick={changeBy(1)}>
            &raquo;
          </Button>
        )}
      </form>
    </div>
  );
};

export default Pagination;
