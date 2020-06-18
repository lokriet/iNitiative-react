import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createAction
} from '@reduxjs/toolkit';
import get from 'lodash/get';
import constants from '../../util/constants';
import ErrorType from '../../util/error';
import { firebaseObtainIdToken } from '../Firebase/firebaseMiddleware';
import * as actions from '../../store/actions';

export const createItemsSlice = (sliceName, slicePath, api) => {
  const entityAdapter = createEntityAdapter({
    selectId: (item) => item._id,
    sortComparer: (a, b) => a.name.localeCompare(b.name)
  });

  const fetchItems = createAsyncThunk(
    `${slicePath.replace('.', '/')}/fetchItems`,
    async (_, thunkApi) => {
      await thunkApi.dispatch(firebaseObtainIdToken());
      const idToken = thunkApi.getState().firebase.idToken;

      const response = await api.fetchItems(idToken);

      if (response.ok) {
        const items = await response.json();
        return items;
      } else {
        return thunkApi.rejectWithValue({
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: 'Fetching items failed'
        });
      }
    },

    {
      condition: (_, { getState }) => {
        const sliceState = get(getState(), slicePath);
        if (
          sliceState.fetching ||
          (sliceState.lastFetchTime &&
            new Date().getTime() - sliceState.lastFetchTime <
              constants.refreshDataTimeout)
        ) {
          return false;
        }
      }
    }
  );

  const parseItemOperationError = async (response) => {
    if (!response) {
      return {
        type: ErrorType.INTERNAL_SERVER_ERROR,
        message: 'Internal error occured. Please try again.'
      };
    } else  if (response.status === 422) {
      const responseData = await response.json();
      return {
        type: ErrorType.VALIDATION_ERROR,
        data: responseData.data
      };
    } else if ([500, 401, 403].includes(response.status)) {
      const responseData = await response.json();
      return {
        type: ErrorType[response.status],
        message: responseData.message
      };
    } else {
      return {
        type: ErrorType.INTERNAL_SERVER_ERROR,
        message: 'Internal error occured. Please try again.'
      };
    }
  };

  const addItem = createAsyncThunk(
    `${slicePath.replace('.', '/')}/addItem`,
    async ({ item, setSubmitted }, thunkApi) => {
      await thunkApi.dispatch(firebaseObtainIdToken());
      const idToken = thunkApi.getState().firebase.idToken;

      const response = await api.addItem(item, idToken);
      if (response.ok) {
        const responseData = await response.json();
        setSubmitted(true);
        return responseData.data;
      } else {
        const error = await parseItemOperationError(response);
        setSubmitted(false);
        return thunkApi.rejectWithValue({
          itemId: null,
          error
        });
      }
    }
  );

  const updateItem = createAsyncThunk(
    `${slicePath.replace('.', '/')}/updateItem`,
    async ({ item, setSubmitted }, thunkApi) => {
      await thunkApi.dispatch(firebaseObtainIdToken());
      const idToken = thunkApi.getState().firebase.idToken;

      const response = await api.updateItem(item, idToken);
      if (response.ok) {
        const responseData = await response.json();
        setSubmitted(true);
        return responseData.data;
      } else {
        const error = await parseItemOperationError(response);
        setSubmitted(false);
        return thunkApi.rejectWithValue({
          itemId: item._id,
          error
        });
      }
    }
  );

  const deleteItem = createAsyncThunk(
    `${slicePath.replace('.', '/')}/deleteItem`,
    async ({ itemId }, thunkApi) => {
      await thunkApi.dispatch(firebaseObtainIdToken());
      const idToken = thunkApi.getState().firebase.idToken;

      const response = await api.deleteItem(itemId, idToken);
      if (response.ok) {
        thunkApi.dispatch(actions.resetParticipantTemplateStore());
        console.log('delete item ok');
        return itemId;
      } else {
        console.log('delete item failed');
        const error = await parseItemOperationError(response);
        console.log(error);
        return thunkApi.rejectWithValue({
          itemId: itemId,
          error
        });
      }
    }
  );

  const removeErrorById = (errors, itemId) => {
    let newErrors = errors;
    const errorId = itemId || 'ADD';

    if (errors[errorId] != null) {
      delete newErrors[errorId];
      if (newErrors == null) {
        newErrors = {};
      }
    }

    return newErrors;
  };

  const initialState = entityAdapter.getInitialState({
    fetching: false,
    error: null,
    errorsById: {},
    lastFetchTime: null
  });

  const removeItemError = createAction(`${slicePath.replace('.', '/')}/removeItemError`);

  const itemsSlice = createSlice({
    name: sliceName,
    initialState,
    extraReducers: {
      [removeItemError]: (state, action) => {
        state.errorsById = removeErrorById(state.errorsById, action.payload);
      },

      [fetchItems.pending]: (state, action) => {
        state.fetching = true;
      },

      [fetchItems.fulfilled]: (state, action) => {
        state.fetching = false;
        state.error = null;
        state.errorsById = {};
        state.lastFetchTime = new Date().getTime();
        entityAdapter.setAll(state, action);
      },

      [fetchItems.rejected]: (state, action) => {
        state.fetching = false;
        state.error = action.payload;
      },

      [addItem.fulfilled]: (state, action) => {
        state.errorsById = removeErrorById(state.errorsById, null);
        entityAdapter.addOne(state, action.payload);
      },

      [addItem.rejected]: (state, action) => {
        state.errorsById.ADD = action.payload.error;
      },

      [updateItem.fulfilled]: (state, action) => {
        state.errorsById = removeErrorById(state.errorsById, action.payload._id);
        console.log('updated', action.payload);
        entityAdapter.updateOne(state, {id: action.payload._id, changes: {...action.payload}});
      },

      [updateItem.rejected]: (state, action) => {
        state.errorsById[action.payload.itemId] = action.payload.error;
      },

      [deleteItem.fulfilled]: (state, action) => {
        console.log('in delete fulfilled', state, action);
        state.errorsById = removeErrorById(state.errorsById, action.payload);
        entityAdapter.removeOne(state, action.payload);
      },

      [deleteItem.rejected]: (state, action) => {
        console.log('in delete rejected', state, action);
        state.errorsById[action.payload.itemId] = action.payload.error;
      },

      'resetStore': (state, action) => initialState
    }
  });

  const reducer = itemsSlice.reducer;
  const sliceActions = {
    removeItemError,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };
  return { actions: sliceActions, reducer, selector: entityAdapter.getSelectors() };
};
