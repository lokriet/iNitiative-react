import {
  createSlice,
  createEntityAdapter,
  createAction
} from '@reduxjs/toolkit';
import { createThunks } from '../../common/store/listOperationThunks';

export const createItemsSlice = (sliceName, slicePath, api) => {
  const entityAdapter = createEntityAdapter({
    selectId: (item) => item._id,
    sortComparer: (a, b) => a.name.localeCompare(b.name)
  });

  const {fetchItems, addItem, updateItem, deleteItem} = createThunks(slicePath, api);

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
        entityAdapter.updateOne(state, {id: action.payload._id, changes: {...action.payload}});
      },

      [updateItem.rejected]: (state, action) => {
        state.errorsById[action.payload.itemId] = action.payload.error;
      },

      [deleteItem.fulfilled]: (state, action) => {
        state.errorsById = removeErrorById(state.errorsById, action.payload);
        entityAdapter.removeOne(state, action.payload);
      },

      [deleteItem.rejected]: (state, action) => {
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
