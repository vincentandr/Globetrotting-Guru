import { localStorageConstants } from '../constants';
import { authHeader, handleResponse } from '../helpers';
import config from './config';

const getById = (id) => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/profile/${id}`, requestOptions)
    .then(handleResponse)
    .then((profile) => {
      localStorage.setItem(
        localStorageConstants.PROFILE,
        JSON.stringify(profile)
      );
      return profile;
    });
};

function getAllAvailableValues() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/profile/available`, requestOptions).then(
    handleResponse
  );
}

const updateFullProfile = (profile) => update(profile, 'POST');

const updateProfile = (profile) => update(profile, 'PATCH');

const update = (profile, method) => {
  const requestOptions = {
    method: method,
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  };
  console.log(profile)
  const { user_id } = profile;

  return fetch(`${config.apiUrl}/profile/${user_id}`, requestOptions).then(
    handleResponse
  );
};

export const profileService = {
  getById,
  getAllAvailableValues,
  updateFullProfile,
  updateProfile,
};
