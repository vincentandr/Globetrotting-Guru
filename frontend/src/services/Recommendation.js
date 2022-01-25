import { message } from 'antd';
import {
  notificationConstants,
  DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS,
} from '../constants';
import { authHeader, handleResponse } from '../helpers';
import config from './config';

const getRandomRecommendation = () => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/recommendation`, requestOptions).then(
    handleResponse
  );
};

const getRecommendationByProfile = (id) => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/recommendation/${id}`, requestOptions).then(
    handleResponse
  );
};

const getRecommendationByImage = (fileList) => {
  message.loading(
    notificationConstants.IMAGE_UPLOADING,
    DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
  );

  const formData = new FormData();
  for (const file of fileList) {
    formData.append('file', file.originFileObj);
  }

  const requestOptions = {
    method: 'POST',    
    headers: { ...authHeader() },
    body: formData,
  };

  return fetch(`http://localhost:5000/recommendation`, requestOptions).then(
    handleResponse
  );
};

export const recommendationService = {
  getRandomRecommendation,
  getRecommendationByProfile,
  getRecommendationByImage,
};
