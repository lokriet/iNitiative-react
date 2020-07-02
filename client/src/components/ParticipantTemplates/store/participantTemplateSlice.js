import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createThunks,
  parseItemOperationError
} from '../../../store/common/listOperationThunks';
import { participantTemplateApi } from './participantTemplateApi';
import { firebaseObtainIdToken } from '../../../store/firebase/firebaseMiddleware';
import { isEmpty } from '../../../util/helper-methods';
import { cleanUpAvatarUrls } from '../../../store/common/commonSlice';
import ParticipantTemplate from './participantTemplateModel';
import { createSelector } from 'redux-orm';
import getOrm from '../../../store/orm/orm';

const api = participantTemplateApi();
const { fetchItems, fetchItem, addItem, updateItem } = createThunks(
  'participantTemplate',
  api
);

// thunks
const fetchTemplates = fetchItems;
const fetchEditedTemplate = (templateId) => fetchItem({ itemId: templateId });

const addTemplate = (templateValues, setSubmitting) =>
  addItem({
    item: templateValues,
    onOperationDone: () => setSubmitting(false)
  });

const updateTemplate = (templateId, templateValues, setSubmitting) =>
  updateItem({
    item: { ...templateValues, _id: templateId },
    onOperationDone: () => setSubmitting(false)
  });

const deleteTemplate = createAsyncThunk(
  'participantTemplate/deleteItem',
  async (template, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.deleteItem(template._id, idToken);
    if (response.ok) {
      if (!isEmpty(template.avatarUrl)) {
        thunkApi.dispatch(cleanUpAvatarUrls([template.avatarUrl]));
      }
      return template._id;
    } else {
      const error = await parseItemOperationError(response);
      return thunkApi.rejectWithValue({
        itemId: template._id,
        error
      });
    }
  }
);

// orm data reducers
ParticipantTemplate.addReducers({
  [fetchItems.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.delete();
    action.payload.forEach((loadedItem) => ModelClass.parse(loadedItem));
  },

  [fetchItem.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.parse(action.payload);
  },

  [addItem.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.parse(action.payload);
  },

  [updateItem.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.parse(action.payload);
  },

  [deleteTemplate.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.withId(action.payload).delete();
  }
});

// ui state reducers
const initialState = {
  fetching: false,
  error: null,
  lastFetchTime: null,
  operationSuccess: false,
  editedItemId: null
};

const operationFailed = (state, action) => {
  state.operationSuccess = false;
  state.error = action.payload.error;
};

const fetchingStart = (state, action) => {
  state.fetching = true;
  state.error = null;
};

const participantTemplateSlice = createSlice({
  name: 'participantTemplate',
  initialState,
  reducers: {
    resetOperation(state, action) {
      state.operationSuccess = false;
      state.error = null;
    },
    resetEditedTemplate(state, action) {
      state.editedItemId = null;
    }
  },
  extraReducers: {
    [addItem.fulfilled]: (state, action) => {
      state.operationSuccess = true;
      state.error = null;
    },
    [addItem.rejected]: operationFailed,

    [updateItem.fulfilled]: (state, action) => {
      state.operationSuccess = true;
      state.error = null;
    },
    [updateItem.rejected]: operationFailed,

    [deleteTemplate.fulfilled]: (state, action) => {
      state.operationSuccess = true;
      state.error = null;
    },
    [deleteTemplate.rejected]: operationFailed,

    [fetchItems.pending]: fetchingStart,
    [fetchItems.fulfilled]: (state, action) => {
      state.fetching = false;
      state.error = null;
      state.lastFetchTime = new Date().getTime();
    },
    [fetchItems.rejected]: (state, action) => {
      state.fetching = false;
      state.error = action.payload;
    },

    [fetchItem.pending]: fetchingStart,
    [fetchItem.fulfilled]: (state, action) => {
      state.fetching = false;
      state.error = null;
      state.editedItemId = action.payload._id;
    },
    [fetchItem.rejected]: (state, action) => {
      state.fetching = false;
      state.error = action.payload.error;
    },

    resetStore: (state, action) => initialState
  }
});

// actions
export {
  fetchTemplates,
  fetchEditedTemplate,
  addTemplate,
  updateTemplate,
  deleteTemplate
};

export const resetTemplateOperation =
  participantTemplateSlice.actions.resetOperation;

export const resetEditedTemplate =
  participantTemplateSlice.actions.resetEditedTemplate;

// selectors
const orm = getOrm();

export const selectParticipantTemplatesByType = createSelector(
  orm,
  (_, type) => type,
  ({ ParticipantTemplate }, type) =>
    ParticipantTemplate.filter((template) => template.type === type)
      .orderBy((template) => template.name.toLowerCase())
      .toModelArray()
      .map((template) => ParticipantTemplate.buildObject(template))
);

export const selectEditedParticipantTemplate = createSelector(
  orm,
  (state) => state.participantTemplate.editedItemId,
  ({ ParticipantTemplate }, editedItemId) =>
    ParticipantTemplate.buildObject(
      ParticipantTemplate.withId(editedItemId)
    )
);

// reducer
export default participantTemplateSlice.reducer;
