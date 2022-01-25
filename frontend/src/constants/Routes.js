import React from 'react';
import { HomePage, LoginPage, RegisterPage, ProfilePage } from '../pages';

export const routeConstants = {
  HOME: {
    path: '/',
    label: 'Home',
    showInHeader: () => true,
    component: <HomePage />,
  },
  LOGIN: {
    path: '/login',
    label: 'Login',
    showInHeader: (loggedIn) => !loggedIn,
    component: <LoginPage />,
  },
  REGISTER: {
    path: '/register',
    label: 'Register',
    showInHeader: (loggedIn) => !loggedIn,
    component: <RegisterPage />,
  },
  PROFILE: {
    path: '/profile',
    label: 'Profile',
    showInHeader: (loggedIn) => loggedIn,
    component: <ProfilePage />,
  },
};
