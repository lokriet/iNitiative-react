import constants from "../../util/constants";
import { firebaseObtainIdToken, firebaseDeleteImage } from "../../components/Firebase/firebaseMiddleware";

export const cleanUpAvatarUrls = (avatarUrlsToCheck) => {
  return async (dispatch, getState) => {
    try {
      if (avatarUrlsToCheck.length > 0) {
        await dispatch(firebaseObtainIdToken());
        const idToken = getState().firebase.idToken;
        const response = await fetch(`${constants.serverUrl}/images/userAvatarUrls`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          }
        });
  
        if (response.ok) {
          const responseData = await response.json();
          const avatarsToDelete = avatarUrlsToCheck.filter(item => !responseData.includes(item));
          avatarsToDelete.forEach(avatarUrl => {
            dispatch(firebaseDeleteImage(avatarUrl));
          });
        } else {
          console.log('failed to check avatar urls - got unexpected response code');
        }
      }
    } catch (error) {
      console.log('failed to check avatar urls', error);
    }
  };
};
