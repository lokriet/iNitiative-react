import { createApi } from '../api/createApi';
import constants from '../../util/constants';

export const createCommonApi = () =>
  createApi({
    fetchUserAvatarUrls: (idToken) =>
      fetch(`${constants.serverUrl}/images/userAvatarUrls`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        }
      })
  });
