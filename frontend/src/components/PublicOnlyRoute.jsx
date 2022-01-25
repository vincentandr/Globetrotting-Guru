import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { routeConstants } from '../constants';
import { getLoggedInUser } from '../helpers';

export const PublicOnlyRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      getLoggedInUser() ? (
        <Redirect
          to={{
            pathname: routeConstants.HOME.path,
            state: { from: props.location },
          }}
        />
      ) : (
        <Component {...props} />
      )
    }
  />
);
