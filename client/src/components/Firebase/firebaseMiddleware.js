import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import config from './firebaseConfig';
import {
  uploadStart,
  uploadProgress,
  uploadFailure,
  uploadSuccess,
  updateIdToken
} from './firebaseSlice';
import { createAction } from '@reduxjs/toolkit';

const FirebaseActionTypes = {
  firebaseSignInWithCustomToken: 'firebase/signInWithCustomToken',
  firebaseSignOut: 'firebase/signOut',
  firebaseUploadImage: 'firebase/uploadImage',
  firebaseDeleteImage: 'firebase/deleteImage'
};

export const firebaseSignInWithCustomToken = createAction(
  FirebaseActionTypes.firebaseSignInWithCustomToken
);
export const firebaseSignOut = createAction(
  FirebaseActionTypes.firebaseSignOut
);
export const firebaseUploadImage = createAction(
  FirebaseActionTypes.firebaseUploadImage
);
export const firebaseDeleteImage = createAction(
  FirebaseActionTypes.firebaseDeleteImage
);
export const firebaseObtainIdToken = createAction(
  FirebaseActionTypes.firebaseObtainIdToken
);

const createFirebaseMiddleware = () => {
  app.initializeApp(config);
  const auth = app.auth();
  const storageRef = app.storage().ref();

  
  const signInWithCustomToken = (store, next, action) => {
    const customToken = action.payload;
    return auth.signInWithCustomToken(customToken).then(() => next(action));
  };

  const obtainIdToken = (store, next, action) => {
    return auth.currentUser
      .getIdToken(true)
      .then((idToken) => {
        // console.log('got firebase id token in middleware', idToken);
        store.dispatch(updateIdToken(idToken));
      })
      .catch((error) => {
        console.log('failed to get firebase id token in middleware', error);
      });
  };

  const signOut = (store, next, action) => {
    return auth.signOut().then(() => next(action));
  }

  const uploadImage = (store, next, action) => {
    const path = `images/${new Date().getTime()}_${action.payload.filename}`;
    const uploadTask = storageRef.child(path).put(action.payload.imageFile);
    store.dispatch(uploadStart());
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        store.dispatch(
          uploadProgress(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
        );
      },

      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthenticated':
            store.dispatch(uploadFailure('You are not logged in'));
            break;

          case 'storage/unauthorized':
            store.dispatch(uploadFailure('Permission denied'));
            break;

          case 'storage/canceled':
            store.dispatch(uploadFailure('Upload cancelled'));
            break;

          case 'storage/unknown':
          default:
            store.dispatch(uploadFailure('Image upload failed'));
        }
      },

      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          store.dispatch(uploadSuccess(downloadURL));
        });
      }
    );
    return next(action);
  };

  const deleteImage = (store, next, action) => {
    const imageUrl = action.payload;
    return storageRef.storage
      .refFromURL(imageUrl)
      .delete()
      .catch((reason) => {
        console.log(
          `Failed to delete image from storage:( url ${imageUrl}`,
          reason
        );
      })
      .finally(() => next(action));
  };


  return (store) => (next) => (action) => {
    try {
      // if (typeof action === 'function') {
      //   return next(action);
      // }

      switch (action.type) {
        case FirebaseActionTypes.firebaseObtainIdToken:
          return obtainIdToken(store, next, action);
        case FirebaseActionTypes.firebaseSignInWithCustomToken:
          return signInWithCustomToken(store, next, action);
        case FirebaseActionTypes.firebaseSignOut:
          return signOut(store, next, action);
        case FirebaseActionTypes.firebaseUploadImage:
          return uploadImage(store, next, action);
        case FirebaseActionTypes.firebaseDeleteImage:
          return deleteImage(store, next, action);
        default:
          return next(action);
      }
    } catch (error) {
      console.log('Firebase middleware failed', error, action);
      // console.log(error);
      // console.log(action);
      // return next(action);
      throw error;
    }
  };
};

export default createFirebaseMiddleware;
