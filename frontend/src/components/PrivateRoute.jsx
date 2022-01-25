import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { routeConstants } from '../constants';
import { getLoggedInUser } from '../helpers';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      getLoggedInUser() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: routeConstants.LOGIN.path,
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
