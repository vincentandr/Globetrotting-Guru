import _ from 'lodash';
import { recommendationConstants } from '../constants';

export const recommendation = (state = {}, action) => {
  switch (action.type) {
    case recommendationConstants.GET_RANDOM_REQUEST:
      return { ...state, fetchingRecommendation: true };
    case recommendationConstants.GET_RANDOM_SUCCESS:
      return {
        recommendation: action.recommendation,
        fetchingRecommendation: false,
      };
    case recommendationConstants.GET_RANDOM_FAILURE:
      return { ...state, fetchingRecommendation: false };
    case recommendationConstants.GET_BY_PROFILE_REQUEST:
      return { ...state, fetchingRecommendation: true };
    case recommendationConstants.GET_BY_PROFILE_SUCCESS:
      return {
        recommendation: action.recommendation,
        fetchingRecommendation: false,
      };
    case recommendationConstants.GET_BY_PROFILE_FAILURE:
      return { ...state, fetchingRecommendation: false };
    case recommendationConstants.GET_BY_IMAGE_REQUEST:
      return { ...state, uploadingImagesForRecommendation: true };
    case recommendationConstants.GET_BY_IMAGE_SUCCESS:
      return {
        recommendation:
          action.recommendation && !_.isEmpty(action.recommendation)
            ? action.recommendation
            : state.recommendation,
        uploadingImagesForRecommendation: false,
      };
    case recommendationConstants.GET_BY_IMAGE_FAILURE:
      return { ...state, uploadingImagesForRecommendation: false };
    default:
      return state;
  }
};
