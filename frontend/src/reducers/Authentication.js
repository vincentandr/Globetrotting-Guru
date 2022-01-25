import { userConstants, localStorageConstants } from '../constants';

let user = JSON.parse(localStorage.getItem(localStorageConstants.USER));
const initialState = user ? { loggedIn: true, user } : {};

export const authentication = (state = initialState, action) => {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_FAILURE:
      return { loggedIn: false };
    case userConstants.LOGOUT:
      return { loggedIn: false };
    default:
      return state;
  }
};
