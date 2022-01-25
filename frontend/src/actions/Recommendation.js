import _ from 'lodash';
import { message } from 'antd';
import {
  recommendationConstants,
  notificationConstants,
  DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS,
} from '../constants';
import { recommendationService } from '../services';

const RECOMMENDATION_GET_DEBOUNCED_MILLIS = 1000;

const getRandomRecommendation = (id) => {
  const request = () => {
    return { type: recommendationConstants.GET_RANDOM_REQUEST };
  };

  return (dispatch) => {
    dispatch(request());

    debouncedGetRecommendation(
      () => recommendationService.getRandomRecommendation(),
      dispatch,
      recommendationConstants.GET_RANDOM_SUCCESS,
      recommendationConstants.GET_RANDOM_FAILURE
    );
  };
};

const getRecommendationByProfile = (id) => {
  const request = () => {
    return { type: recommendationConstants.GET_BY_PROFILE_REQUEST };
  };

  return (dispatch) => {
    dispatch(request());

    debouncedGetRecommendation(
      () => recommendationService.getRecommendationByProfile(id),
      dispatch,
      recommendationConstants.GET_BY_PROFILE_SUCCESS,
      recommendationConstants.GET_BY_PROFILE_FAILURE
    );
  };
};

const getRecommendationByImage = (fileList) => {
  const request = () => {
    return { type: recommendationConstants.GET_BY_IMAGE_REQUEST };
  };

  return (dispatch) => {
    dispatch(request());

    debouncedGetRecommendation(
      () => recommendationService.getRecommendationByImage(fileList),
      dispatch,
      recommendationConstants.GET_BY_IMAGE_SUCCESS,
      recommendationConstants.GET_BY_IMAGE_FAILURE,
      notificationConstants.IMAGE_UPLOADED_SUCCESS,
      notificationConstants.IMAGE_UPLOADED_ERROR
    );
  };
};

const debouncedGetRecommendation = _.debounce(
  (
    getPromiseFunc,
    dispatch,
    successActionType,
    failureActionType,
    successNotification,
    errorNotification
  ) => {
    const success = (recommendation) => {
      return {
        type: successActionType,
        recommendation,
      };
    };
    const failure = (error) => {
      return { type: failureActionType, error };
    };

    getPromiseFunc()
      .then(
        (recommendation) => {
          successNotification &&
            message.success(
              successNotification,
              DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
            );
          return dispatch(success(recommendation));
        },
        (error) => {
          errorNotification &&
            message.error(
              errorNotification,
              DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
            );
          return dispatch(failure(error.toString()));
        }
      )
      .catch((err) => {
        errorNotification &&
          message.error(
            errorNotification,
            DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
          );
        return dispatch(failure(err));
      });
  },
  RECOMMENDATION_GET_DEBOUNCED_MILLIS,
  { leading: true, trailing: false }
);

export const recommendationActions = {
  getRandomRecommendation,
  getRecommendationByProfile,
  getRecommendationByImage,
};
