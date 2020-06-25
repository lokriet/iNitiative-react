import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { encounterApi } from '../../api/encounterApi';
import {
  createThunks,
  parseItemOperationError
} from '../../common/store/listOperationThunks';
import { firebaseObtainIdToken } from '../Firebase/firebaseMiddleware';
import * as actions from '../../store/actions';

const api = encounterApi();
const { fetchItems, fetchItem, addItem } = createThunks('encounter', api);

const fetchEncounters = fetchItems;

const fetchEditedEncounter = (encounterId) =>
  fetchItem({ itemId: encounterId });

const fetchLatestEncounter = createAsyncThunk(
  'encounter/fetchLatestItem',
  async (_, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.fetchLatestItem(idToken);
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      const error = await parseItemOperationError(response);
      return thunkApi.rejectWithValue(error);
    }
  }
);

const addEncounter = (encounter) => addItem({ item: encounter });

export const EditedEncounterAction = {
  Set: 'set',
  Update: 'update'
};

const updateItem = createAsyncThunk(
  'encounter/updateItem',
  async ({ itemId, partialUpdate, userOptions }, thunkApi) => {
    let options = {
      editedEncounterAction: EditedEncounterAction.Set,
      applyChangesOnError: false,
      overwriteError: true
    };
    if (userOptions) {
      options = { ...options, ...userOptions };
    }

    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.updateItem(itemId, partialUpdate, idToken);
    if (response.ok) {
      const responseData = await response.json();
      return {
        encounterId: itemId,
        result: responseData.data,
        partialUpdate,
        options
      };
    } else {
      const error = await parseItemOperationError(response);
      return thunkApi.rejectWithValue({
        encounterId: itemId,
        partialUpdate,
        options,
        error
      });
    }
  }
);

const updateEncounter = (encounterId, partialUpdate, userOptions) =>
  updateItem({ itemId: encounterId, partialUpdate, userOptions });

const deleteEncounter = createAsyncThunk(
  'encounter/deleteItem',
  async (encounterId, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    let avatarUrlsToCheck = [];
    const avatarsResponse = await api.fetchItemAvatarUrls(encounterId, idToken);
    if (avatarsResponse.ok) {
      avatarUrlsToCheck = await avatarsResponse.json();
    } else {
      // TODO
      console.log(
        'Failed to clean up avatars on encounter delete',
        encounterId
      );
    }

    const response = await api.deleteItem(encounterId, idToken);
    if (response.ok) {
      thunkApi.dispatch(actions.cleanUpAvatarUrls(avatarUrlsToCheck));
      return encounterId;
    } else {
      const error = await parseItemOperationError(response);
      return thunkApi.rejectWithValue(error);
    }
  }
);

const updateChildItem = createAsyncThunk(
  'encounter/updateChildItem',
  async ({ encounterId, participantId, partialUpdate }, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.updateChildItem(
      encounterId,
      participantId,
      partialUpdate,
      idToken
    );
    if (response.ok) {
      return {
        encounterId,
        participantId,
        partialUpdate
      };
    } else {
      const error = await parseItemOperationError(response);
      return thunkApi.rejectWithValue({
        error,
        encounterId,
        participantId,
        partialUpdate
      });
    }
  }
);

const updateEncounterParticipant = (
  encounterId,
  participantId,
  partialUpdate
) => updateChildItem({ encounterId, participantId, partialUpdate });

const entityAdapter = createEntityAdapter({
  selectId: (item) => item._id,
  sortComparer: (a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
});

const initialState = entityAdapter.getInitialState({
  fething: false,
  fetchingError: null,
  operationError: null,
  operationSuccess: false,
  editedItemId: null,
  latestItemId: null,
  lastFetchTime: null
});

const startFetching = (state, action) => {
  state.fetching = true;
  state.fetchingError = null;
};

const operationFailed = (state, action) => {
  state.operationSuccess = false;
  state.operationError = action.payload.error;
};

const applyParticipantUpdate = (
  state,
  encounterId,
  participantId,
  partialUpdate
) => {
  const encounter = entityAdapter.getSelectors().selectById(state, encounterId);
  let newParticipants = [...encounter.participants];
  newParticipants = newParticipants
    .map((item) =>
      item._id === participantId.toString()
        ? {...item, ...partialUpdate}
        : item
    );
  const encounterPartialUpdate = {
    participants: newParticipants,
    updatedAt: new Date()
  };
  entityAdapter.updateOne(state, {
    id: encounterId,
    changes: encounterPartialUpdate
  });
};

const encounterSlice = createSlice({
  name: 'encounter',
  initialState,
  reducers: {
    resetOperation: (state, action) => {
      state.operationSuccess = false;
      state.operationError = null;
    },
    resetEditedEncounter: (state, aciton) => {
      state.editedItemId = null;
    },
    resetLatestEncounter: (state, action) => {
      state.latestItemId = null;
    }
  },
  extraReducers: {
    [fetchItems.pending]: startFetching,
    [fetchItems.fulfilled]: (state, action) => {
      state.fetching = false;
      state.fetchingError = null;
      state.lastFetchTime = new Date().getTime();
      entityAdapter.setAll(state, action.payload);
    },
    [fetchItems.rejected]: (state, action) => {
      state.fetching = false;
      state.fetchingError = action.payload;
    },

    [fetchItem.pending]: startFetching,
    [fetchItem.fulfilled]: (state, action) => {
      console.log(action);
      state.fetching = false;
      state.fetchingError = null;
      state.editedItemId = action.payload._id;
      entityAdapter.upsertOne(state, action.payload);
    },
    [fetchItem.rejected]: (state, action) => {
      state.fetching = false;
      state.fetchingError = action.payload.error;
    },

    [fetchLatestEncounter.pending]: startFetching,
    [fetchLatestEncounter.fulfilled]: (state, action) => {
      state.fetching = false;
      state.fetchingError = null;
      state.latestItemId = action.payload._id;
      entityAdapter.upsertOne(state, action.payload);
    },
    [fetchLatestEncounter.rejected]: (state, action) => {
      state.fetching = false;
      state.fetchingError = action.payload.error;
    },

    [addItem.fulfilled]: (state, action) => {
      state.operationError = null;
      state.operationSuccess = true;
      entityAdapter.addOne(state, action.payload);
    },
    [addItem.rejected]: operationFailed,

    [deleteEncounter.fulfilled]: (state, action) => {
      state.operationSuccess = true;
      state.operationError = null;
      entityAdapter.removeOne(state, action.payload);
    },
    [deleteEncounter.rejected]: operationFailed,

    [updateItem.fulfilled]: (state, action) => {
      const options = action.payload.options;

      state.operationError = options.overwriteError
        ? null
        : state.operationError;
      state.operationSuccess = true;

      if (options.editedEncounterAction === EditedEncounterAction.Update) {
        entityAdapter.updateOne(state, {
          id: action.payload.encounterId,
          changes: action.payload.partialUpdate
        });
        entityAdapter.updateOne(state, {
          id: action.payload.encounterId,
          changes: { updatedAt: new Date() }
        });
      } else if (options.editedEncounterAction === EditedEncounterAction.Set) {
        entityAdapter.updateOne(state, {
          id: action.payload.encounterId,
          changes: action.payload.result
        });
      }
    },
    [updateItem.rejected]: (state, action) => {
      state.operationError = action.payload.error;
      state.operationSuccess = false;

      if (action.payload.options.applyChangesOnError) {
        entityAdapter.updateOne(state, {
          id: action.payload.encounterId,
          changes: action.payload.partialUpdate
        });
        entityAdapter.updateOne(state, {
          id: action.payload.encounterId,
          changes: { updatedAt: new Date() }
        });
      }
    },

    [updateChildItem.fulfilled]: (state, action) => {
      applyParticipantUpdate(
        state,
        action.payload.encounterId,
        action.payload.participantId,
        action.payload.partialUpdate
      );
      // entityAdapter.updateOne(state, {
      //   id: action.payload.encounterId,
      //   changes: { updatedAt: new Date() }
      // });
    },
    [updateChildItem.rejected]: (state, action) => {
      state.operationError = action.payload.error;
      state.operationSuccess = false;

      applyParticipantUpdate(
        state,
        action.payload.encounterId,
        action.payload.participantId,
        action.payload.partialUpdate
      );
      // entityAdapter.updateOne(state, {
      //   id: action.payload.encounterId,
      //   changes: { updatedAt: new Date() }
      // });
    },

    resetStore: (state, action) => initialState
  }
});

const entitySelectors = entityAdapter.getSelectors();

const selectEditedEncounter = (state) =>
  entitySelectors.selectById(state.encounter, state.encounter.editedItemId);

const selectLatestEncounter = (state) =>
  entitySelectors.selectById(state.encounter, state.encounter.latestItemId);

// reducer
export default encounterSlice.reducer;

// actions
export {
  fetchEncounters,
  fetchEditedEncounter,
  fetchLatestEncounter,
  addEncounter,
  updateEncounter,
  updateEncounterParticipant,
  deleteEncounter
};
export const resetEncounterOperation = encounterSlice.actions.resetOperation;
export const resetEditedEncounter = encounterSlice.actions.resetEditedEncounter;
export const resetLatestEncounter = encounterSlice.actions.resetLatestEncounter;

// selectors
export { selectEditedEncounter, selectLatestEncounter };
export const selectAll = (state) => entitySelectors.selectAll(state.encounter);
