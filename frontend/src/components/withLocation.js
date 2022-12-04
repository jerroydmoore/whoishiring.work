// https://medium.com/@chrisfitkin/how-to-get-query-string-parameter-values-in-gatsby-f714161104f

import React from 'react';
import { Location } from '@gatsbyjs/reach-router';
import queryString from 'query-string';

const withLocation = (ComponentToWrap) => (props) => (
  <Location>
    {({ location, navigate }) => (
      <ComponentToWrap
        {...props}
        location={location}
        navigate={navigate}
        search={location.search ? queryString.parse(location.search) : {}}
      />
    )}
  </Location>
);

export default withLocation;
