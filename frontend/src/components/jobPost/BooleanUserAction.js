import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const BooleanUserAction = (props) => {
  const [value, setValue] = useState(props.value);
  const [loading, setLoading] = useState(false);
  const icon = loading ? faSpinner : value ? props.trueIcon : props.falseIcon;

  const onClick = async () => {
    if (loading) return;
    const newValue = !value;
    setLoading(true);
    if (await props.onClick(props.field, newValue)) {
      setValue(newValue);
    }
    setLoading(false);
  };

  return (
    <Button variant="light" className="card-link" onClick={onClick}>
      <FontAwesomeIcon icon={icon} pulse={loading} /> {value ? props.trueLabel : props.falseLabel}
    </Button>
  );
};

export default BooleanUserAction;
