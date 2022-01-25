import { message } from 'antd';
import _ from 'lodash';
import {
  DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS,
  profileConstants,
  notificationConstants,
} from '../constants';
import { profileService } from '../services';

const USER_UPDATE_DEBOUNCED_MILLIS = 1000;

const getById = (id) => {
  const request = () => {
    return { type: profileConstants.GET_BY_ID_REQUEST };
  };
  const success = (profile) => {
    return { type: profileConstants.GET_BY_ID_SUCCESS, profile };
  };
  const failure = (error) => {
    return { type: profileConstants.GET_BY_ID_FAILURE, error };
  };

  return (dispatch) => {
    dispatch(request());

    profileService.getById(id).then(
      (profile) => dispatch(success(profile)),
      (error) => dispatch(failure(error.toString()))
    );
  };
};

const getAllAvailableValues = () => {
  const request = () => {
    return { type: profileConstants.GET_ALL_AVAILABLE_VALUES_REQUEST };
  };
  const success = (profileValues) => {
    return {
      type: profileConstants.GET_ALL_AVAILABLE_VALUES_SUCCESS,
      profileValues,
    };
  };
  const failure = (error) => {
    return { type: profileConstants.GET_ALL_AVAILABLE_VALUES_FAILURE, error };
  };

  return (dispatch) => {
    dispatch(request());

    profileService.getAllAvailableValues().then(
      (profileValues) => dispatch(success(profileValues)),
      (error) => dispatch(failure(error.toString()))
    );
  };
};

const updateFullProfile = (profile) => {
  const request = (profile) => {
    return { type: profileConstants.UPDATE_FULL_BY_ID_REQUEST, profile };
  };

  return (dispatch) => {
    dispatch(request(profile));
    debouncedUpdate(
      profile,
      dispatch,
      profileConstants.UPDATE_FULL_BY_ID_SUCCESS,
      notificationConstants.PROFILE_UPDATED_SUCCESS,
      profileConstants.UPDATE_FULL_BY_ID_FAILURE,
      notificationConstants.PROFILE_UPDATED_ERROR
    );
  };
};

const updateProfile = (profile, updateCurrentProfileFunc = (currentProfile) => currentProfile) => {
  const request = (profile) => {
    return { type: profileConstants.UPDATE_BY_ID_REQUEST, profile, updateCurrentProfileFunc };
  };

  return (dispatch) => {
    dispatch(request(profile));
    debouncedUpdate(
      profile,
      dispatch,
      profileConstants.UPDATE_BY_ID_SUCCESS,
      notificationConstants.PROFILE_VIA_FEEDBACK_UPDATED_SUCCESS,
      profileConstants.UPDATE_BY_ID_FAILURE,
      notificationConstants.PROFILE_VIA_FEEDBACK_UPDATED_ERROR
    );
  };
};

const normalUpdate = (
  updatedProfile,
  dispatch,
  successActionType,
  successNotification,
  failureActionType,
  errorNotification
) => {
  const success = () => {
    return { type: successActionType };
  };
  const failure = (error) => {
    return { type: failureActionType, error };
  };

  profileService.updateFullProfile(updatedProfile).then(
    () => {
      message.success(
        successNotification,
        DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
      );
      return dispatch(success());
    },
    (error) => {
      message.error(
        errorNotification,
        DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
      );
      return dispatch(failure(error.toString()));
    }
  );
};

const debouncedUpdate = _.debounce(normalUpdate, USER_UPDATE_DEBOUNCED_MILLIS);

export const profileActions = {
  getById,
  getAllAvailableValues,
  updateFullProfile,
  updateProfile,
};
