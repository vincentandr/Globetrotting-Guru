import { localStorageConstants } from '../constants';

export const getLoggedInUser = () => {
  return localStorage.getItem(localStorageConstants.USER);
};

export const authHeader = () => {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem(localStorageConstants.USER));

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};
