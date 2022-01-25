export const notificationConstants = {
  VALIDATION_ERROR: 'Please make sure all fields are properly filled in.',
  LOGIN_ERROR: 'Error logging in. Please check your username or password.',
  REGISTER_ERROR:
    'Error registering user. Please try again later/with a different username or password.',
  LOGGED_OUT: 'Logged out successfully!',
  PROFILE_UPDATED_SUCCESS: 'Profile successfully updated.',
  PROFILE_UPDATED_ERROR: 'Error updating profile. Please try again later.',
  PROFILE_VIA_FEEDBACK_UPDATED_SUCCESS: 'Preference registered successfully.',
  PROFILE_VIA_FEEDBACK_UPDATED_ERROR:
    'Error registering preference. Please try again later.',
  IMAGE_UPLOADING: 'Your images are being uploaded...',
  IMAGE_UPLOADED_SUCCESS: 'Here is your recommendation!',
  IMAGE_UPLOADED_ERROR: 'Failed to upload images. Please try again later.',
};

export const DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS = 2;
