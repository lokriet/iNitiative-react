import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { encounterApi } from './encounterApi';
import {
  createThunks,
  parseItemOperationError
} from '../../../store/common/listOperationThunks';
import { firebaseObtainIdToken } from '../../../store/firebase/firebaseMiddleware';
import { cleanUpAvatarUrls } from '../../../store/common/commonSlice';
import { Encounter } from './encounterModel';
import getOrm from '../../../store/orm/orm';
import { createSelector as createOrmSelector } from 'redux-orm';

const api = encounterApi();

// thunks
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
      thunkApi.dispatch(cleanUpAvatarUrls(avatarUrlsToCheck));
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

// orm state slice
Encounter.addReducers({
  [fetchItems.fulfilled.type]: (action, ModelClass, session) => {
    const {
      Encounter,
      EncounterMap,
      EncounterParticipant,
      AreaEffect,
      ParticipantCoordinate
    } = session;
    Encounter.delete();
    EncounterMap.delete();
    EncounterParticipant.delete();
    AreaEffect.delete();
    ParticipantCoordinate.delete();

    action.payload.forEach((loadedItem) => ModelClass.parse(loadedItem));
  },

  [fetchItem.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.parse(action.payload);
  },

  [fetchLatestEncounter.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.parse(action.payload);
  },

  [addItem.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.parse(action.payload);
  },

  [deleteEncounter.fulfilled.type]: (action, ModelClass, session) => {
    ModelClass.withId(action.payload).delete();
  },

  [updateItem.fulfilled.type]: (action, ModelClass, session) => {
    const options = action.payload.options;

    if (options.editedEncounterAction === EditedEncounterAction.Update) {
      ModelClass.withId(action.payload.encounterId).applyUpdate({
        ...action.payload.partialUpdate,
        updatedAt: new Date()
      });
    } else if (options.editedEncounterAction === EditedEncounterAction.Set) {
      ModelClass.parse(action.payload.result);
    }
  },

  [updateItem.rejected.type]: (action, ModelClass, session) => {
    if (action.payload.options.applyChangesOnError) {
      ModelClass.withId(action.payload.encounterId).applyUpdate({
        ...action.payload.partialUpdate,
        updatedAt: new Date()
      });
    }
  },

  [updateChildItem.fulfilled.type]: (action, ModelClass, session) => {
    session.EncounterParticipant.withId(
      action.payload.participantId
    ).applyUpdate(action.payload.partialUpdate);

    ModelClass.withId(action.payload.encounterId).applyUpdate({
      updatedAt: new Date()
    });
  },

  [updateChildItem.rejected.type]: (action, ModelClass, session) => {
    session.EncounterParticipant.withId(
      action.payload.participantId
    ).applyUpdate(action.payload.partialUpdate);

    ModelClass.withId(action.payload.encounterId).applyUpdate({
      updatedAt: new Date()
    });
  }
});

// ui state slice
const updateEncounterParticipant = (
  encounterId,
  participantId,
  partialUpdate
) => updateChildItem({ encounterId, participantId, partialUpdate });

const initialState = {
  fething: false,
  fetchingError: null,
  operationError: null,
  operationSuccess: false,
  editedItemId: null,
  latestItemId: null,
  lastFetchTime: null
};

const startFetching = (state, action) => {
  state.fetching = true;
  state.fetchingError = null;
};

const operationFailed = (state, action) => {
  state.operationSuccess = false;
  state.operationError = action.payload.error;
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
    },
    [fetchItems.rejected]: (state, action) => {
      state.fetching = false;
      state.fetchingError = action.payload;
    },

    [fetchItem.pending]: startFetching,
    [fetchItem.fulfilled]: (state, action) => {
      state.fetching = false;
      state.fetchingError = null;
      state.editedItemId = action.payload._id;
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
    },
    [fetchLatestEncounter.rejected]: (state, action) => {
      state.fetching = false;
      state.fetchingError = action.payload.error;
    },

    [addItem.fulfilled]: (state, action) => {
      state.operationError = null;
      state.operationSuccess = true;
    },
    [addItem.rejected]: operationFailed,

    [deleteEncounter.fulfilled]: (state, action) => {
      state.operationSuccess = true;
      state.operationError = null;
    },
    [deleteEncounter.rejected]: operationFailed,

    [updateItem.fulfilled]: (state, action) => {
      const options = action.payload.options;

      state.operationError = options.overwriteError
        ? null
        : state.operationError;
      state.operationSuccess = true;
    },
    [updateItem.rejected]: (state, action) => {
      state.operationError = action.payload.error;
      state.operationSuccess = false;
    },

    [updateChildItem.rejected]: (state, action) => {
      state.operationError = action.payload.error;
      state.operationSuccess = false;
    },

    resetStore: (state, action) => initialState
  }
});

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
const orm = getOrm();
export const selectAll = createOrmSelector(orm, ({ Encounter }) =>
  Encounter.orderBy(
    (encounter) => new Date(encounter.updatedAt).getTime(),
    'desc'
  ).toRefArray()
);

export const selectEditedEncounter =
  createOrmSelector(orm,
  (state) => state.encounter.editedItemId,
  ({Encounter}, editedEncounterId) =>
    Encounter.buildObject(Encounter.withId(editedEncounterId)));

export const selectLatestEncounter =
  createOrmSelector(orm,
  (state) => state.encounter.latestItemId,
  ({Encounter}, latestEncounterId) =>
    Encounter.buildObject(Encounter.withId(latestEncounterId)));

// reducer
export default encounterSlice.reducer;
