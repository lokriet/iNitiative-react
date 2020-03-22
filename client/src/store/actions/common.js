import constants from "../../util/constants";

export const cleanUpAvatarUrls = (avatarUrlsToCheck) => {
  return async (dispatch, getState) => {
    try {
      if (avatarUrlsToCheck.length > 0) {
        const idToken = await getState().auth.firebase.doGetIdToken();
        const response = await fetch(`${constants.serverUrl}/images/userAvatarUrls`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          }
        });
  
        if (response.status === 200) {
          const responseData = await response.json();
          const avatarsToDelete = avatarUrlsToCheck.filter(item => !responseData.includes(item));
          avatarsToDelete.forEach(avatarUrl => {
            getState().auth.firebase.doDeleteImage(avatarUrl);
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
