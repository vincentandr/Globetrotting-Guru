import { profileConstants, localStorageConstants } from '../constants';

let baseValues = JSON.parse(
  localStorage.getItem(localStorageConstants.AVAILABLE_VALUES)
);
const initialState = baseValues ? { baseValues } : {};

export const base = (state = initialState, action) => {
  switch (action.type) {
    case profileConstants.GET_ALL_AVAILABLE_VALUES_REQUEST:
      return { fetchingAvailableProfileValues: true };
    case profileConstants.GET_ALL_AVAILABLE_VALUES_SUCCESS:
      return { profileValues: action.profileValues };
    case profileConstants.GET_ALL_AVAILABLE_VALUES_FAILURE:
      return {};
    default:
      return state;
  }
};
