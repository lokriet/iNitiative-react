export const cleanUpAvatarUrls = (avatarUrlsToCheck) => {
  return async (dispatch, getState) => {
    try {

      if (avatarUrlsToCheck.length > 0) {
        const idToken = await getState().auth.firebase.doGetIdToken();
        const response = await fetch('http://localhost:3001/users/avatarUrls', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          }
        });
  
        const responseData = await response.json();
        if (response.status === 200) {
          const avatarsToDelete = avatarUrlsToCheck.filter(item => !responseData.includes(item));
          avatarsToDelete.forEach(avatarUrl => {
            console.log('deleting avatar ', avatarUrl);
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
