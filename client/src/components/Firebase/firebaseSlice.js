import { createSlice, combineReducers } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  progress: null,
  error: null,
  downloadUrl: null
};

const imageSlice = createSlice({
  name: 'firebaseImage',
  initialState,
  reducers: {
    uploadStart(state, action) {
      state = { ...initialState, loading: true };
    },
    uploadProgress(state, action) {
      state.progress = action.payload.progress;
    },
    uploadFailure(state, action) {
      state.error = action.payload.error;
      state.loading = false;
      state.progress = null;
    },
    uploadSuccess(state, action) {
      state.loading = false;
      state.progress = null;
      state.downloadUrl = action.payload.downloadUrl;
    }
  }
});

const idTokenSlice = createSlice({
  name: 'firebaseIdToken',
  initialState: null,
  reducers: {
    updateIdToken(state, action) {
      return action.payload;
    }
  }
});

export const {
  uploadStart,
  uploadProgress,
  uploadFailure,
  uploadSuccess
} = imageSlice.actions;

export const {
  updateIdToken
} = idTokenSlice.actions;

const firebaseReducer = combineReducers({
  image: imageSlice.reducer,
  idToken: idTokenSlice.reducer
})

export default firebaseReducer;
