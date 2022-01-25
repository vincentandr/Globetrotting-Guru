import config from './config';
import { handleResponse, authHeader } from '../helpers';
import { localStorageConstants } from '../constants';

const login = (username, password) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };

  console.log(`${config.apiUrl}/users/authenticate`)
  return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      localStorage.setItem(localStorageConstants.USER, JSON.stringify(user));
      return user;
    });
};

const logout = () => {
  // remove user from local storage to log user out
  localStorage.removeItem(localStorageConstants.USER);
};

const register = (user) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/users/register`, requestOptions).then(
    handleResponse
  );
};

const update = (user) => {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(
    handleResponse
  );
};

export const userService = {
  login,
  logout,
  register,
  update,
};
