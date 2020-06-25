import { createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseObtainIdToken, firebaseDeleteImage } from '../firebase/firebaseMiddleware';
import { createCommonApi } from './commonApi';

const commonApi = createCommonApi();

export const cleanUpAvatarUrls = createAsyncThunk(
  'common/cleanUpAvatarUrls',
  async (avatarUrlsToCheck, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await commonApi.fetchUserAvatarUrls(idToken);
    if (response.ok) {
      const responseData = await response.json();
      const avatarsToDelete = avatarUrlsToCheck.filter(
        (item) => !responseData.includes(item)
      );
      avatarsToDelete.forEach((avatarUrl) => {
        thunkApi.dispatch(firebaseDeleteImage(avatarUrl));
      });
      return true;
    } else {
      console.log(
        'failed to check avatar urls - got unexpected response code'
      );
      return thunkApi.rejectWithValue(false);
    }
  }
);

