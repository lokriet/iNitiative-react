import { createApi } from '../../store/api/createApi';
import constants from '../../util/constants';

export const createAuthApi = () =>
  createApi({
    login: (email, password) =>
      fetch(`${constants.serverUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      }),

    register: (username, email, password) =>
      fetch(`${constants.serverUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      }),

    fetchUserInfo: (idToken) =>
      fetch(`${constants.serverUrl}/users/userinfo`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }),

    requestPasswordReset: (email) =>
      fetch(`${constants.serverUrl}/auth/sendPasswordResetEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      }),

    resetPassword: (password, resetPasswordToken) =>
      fetch(`${constants.serverUrl}/auth/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password,
          resetPasswordToken
        })
      })
  });
