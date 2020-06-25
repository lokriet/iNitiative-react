import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk
} from '@reduxjs/toolkit';
import {
  createThunks,
  parseItemOperationError
} from '../../common/store/listOperationThunks';
import { participantTemplateApi } from '../../api/participantTemplateApi';
import { firebaseObtainIdToken } from '../Firebase/firebaseMiddleware';
import { isEmpty } from '../../util/helper-methods';
import * as actions from '../../store/actions';

const api = participantTemplateApi();
const { fetchItems, fetchItem, addItem, updateItem } = createThunks(
  'participantTemplate',
  api
);

export const fetchTemplates = fetchItems;
export const fetchEditedTemplate = (templateId) =>
  fetchItem({ itemId: templateId });

export const addTemplate = (_, templateValues, setSubmitting) =>
  addItem({
    item: templateValues,
    onOperationDone: () => setSubmitting(false)
  });

export const updateTemplate = (templateId, templateValues, setSubmitting) =>
  updateItem({
    item: { ...templateValues, _id: templateId },
    onOperationDone: () => setSubmitting(false)
  });

export const deleteTemplate = createAsyncThunk(
  'participantTemplate/deleteItem',
  async (template, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.deleteItem(template._id, idToken);
    if (response.ok) {
      if (!isEmpty(template.avatarUrl)) {
        thunkApi.dispatch(actions.cleanUpAvatarUrls([template.avatarUrl]));
      }
      return template._id;
    } else {
      console.log('delete item failed');
      const error = await parseItemOperationError(response);
      console.log(error);
      return thunkApi.rejectWithValue({
        itemId: template._id,
        error
      });
    }
  }
);

const entityAdapter = createEntityAdapter({
  selectId: (item) => item._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const initialState = entityAdapter.getInitialState({
  fetching: false,
  error: null,
  lastFetchTime: null,
  operationSuccess: false,
  editedItemId: null
});

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
      entityAdapter.addOne(state, action.payload);
    },
    [addItem.rejected]: operationFailed,

    [updateItem.fulfilled]: (state, action) => {
      state.operationSuccess = true;
      state.error = null;
      entityAdapter.updateOne(state, {
        id: action.payload._id,
        changes: { ...action.payload }
      });
    },
    [updateItem.rejected]: operationFailed,

    [deleteTemplate.fulfilled]: (state, action) => {
      state.operationSuccess = true;
      state.error = null;
      entityAdapter.removeOne(state, action.payload);
    },
    [deleteTemplate.rejected]: operationFailed,

    [fetchItems.pending]: fetchingStart,
    [fetchItems.fulfilled]: (state, action) => {
      state.fetching = false;
      state.error = null;
      state.lastFetchTime = new Date().getTime();
      entityAdapter.setAll(state, action.payload);
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
      entityAdapter.upsertOne(state, action.payload);
    },
    [fetchItem.rejected]: (state, action) => {
      state.fetching = false;
      state.error = action.payload.error;
    },

    resetStore: (state, action) => initialState
  }
});

export const resetTemplateOperation =
  participantTemplateSlice.actions.resetOperation;

export const resetEditedTemplate =
  participantTemplateSlice.actions.resetEditedTemplate;

const entitySelectors = entityAdapter.getSelectors();

const selectAllParticipantTemplates = (state) =>
  entitySelectors.selectAll(state.participantTemplate);

export const selectParticipantTemplatesByType = createSelector(
  selectAllParticipantTemplates,
  (_, type) => type,
  (allTemplates, type) => allTemplates.filter((item) => item.type === type)
);

export const selectEditedParticipantTemplate = (state) =>
  entitySelectors.selectById(
    state.participantTemplate,
    state.participantTemplate.editedItemId
  );

export default participantTemplateSlice.reducer;
