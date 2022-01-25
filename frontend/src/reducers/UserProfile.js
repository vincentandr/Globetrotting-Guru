import _ from 'lodash';
import {
  localStorageConstants,
  profileConstants,
  profileValuesConstants,
} from '../constants';

let profile = JSON.parse(localStorage.getItem(localStorageConstants.PROFILE));
const initialState = profile ? { profile } : {};

export const userProfile = (state = initialState, action) => {
  switch (action.type) {
    case profileConstants.GET_BY_ID_REQUEST:
      return { profile: action.profile, fetchingProfile: true };
    case profileConstants.GET_BY_ID_SUCCESS:
      return { profile: action.profile, fetchingProfile: false };
    case profileConstants.GET_BY_ID_FAILURE:
      return { profile: action.profile, fetchingProfile: false };
    case profileConstants.UPDATE_FULL_BY_ID_REQUEST:
      return { ...state, profile: action.profile, updatingProfile: true };
    case profileConstants.UPDATE_BY_ID_REQUEST:
      return {
        ...state,
        profile: state.updateCurrentProfileFunc(_.get(state, 'profile', {})),
        updatingProfile: true,
      };
    case profileConstants.UPDATE_FULL_BY_ID_SUCCESS:
    case profileConstants.UPDATE_BY_ID_SUCCESS:
      return { ...state, updatingProfile: false };
    case profileConstants.UPDATE_FULL_BY_ID_FAILURE:
    case profileConstants.UPDATE_BY_ID_FAILURE:
      return { ...state, updatingProfile: false };
    default:
      return state;
  }
};
