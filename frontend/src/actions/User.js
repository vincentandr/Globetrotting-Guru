import { message } from 'antd';
import {
  userConstants,
  notificationConstants,
  DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS,
} from '../constants';
import { userService } from '../services';
import { history } from '../helpers';

const login = (username, password) => {
  const request = (user) => {
    return { type: userConstants.LOGIN_REQUEST, user };
  };
  const success = (user) => {
    return { type: userConstants.LOGIN_SUCCESS, user };
  };
  const failure = (error) => {
    message.error(
      notificationConstants.LOGIN_ERROR,
      DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
    );
    return { type: userConstants.LOGIN_FAILURE, error };
  };

  return (dispatch) => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      (user) => {
        dispatch(success(user));
        history.push('/');
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
};

const logout = () => {
  userService.logout();
  return { type: userConstants.LOGOUT };
};

const register = (user) => {
  const request = (user) => {
    return { type: userConstants.REGISTER_REQUEST, user };
  };
  const success = (user) => {
    return { type: userConstants.REGISTER_SUCCESS, user };
  };
  const failure = (error) => {
    message.error(
      notificationConstants.REGISTER_ERROR,
      DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
    );
    return { type: userConstants.REGISTER_FAILURE, error };
  };

  return (dispatch) => {
    dispatch(request(user));

    userService.register(user).then(
      (user) => {
        dispatch(success());
        history.push('/login');
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
};

export const userActions = {
  login,
  logout,
  register,
};
