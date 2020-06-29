import { itemsApi } from './itemsApi';
import { createThunks } from '../../../store/common/listOperationThunks';
import { createSlice} from '@reduxjs/toolkit';

export const createItemsSlice = (itemsTypeName, ItemsModelClass, isHomebrew) => {
  const api = itemsApi(itemsTypeName, isHomebrew);

  // thunks
  const { fetchItems, addItem, updateItem, deleteItem } = createThunks(
    `${itemsTypeName}.${isHomebrew ? 'homebrew' : 'shared'}`,
    api
  );

  // orm data reducers
  ItemsModelClass.addReducers({
    [fetchItems.fulfilled.type]: (action, ModelClass, session) => {
      ModelClass.filter({ isHomebrew }).delete();
      action.payload.forEach((loadedItem) => ModelClass.upsert(loadedItem));
    },
    
    [addItem.fulfilled.type]: (action, ModelClass, session) => {
      ModelClass.create(action.payload);
    },

    [updateItem.fulfilled.type]: (action, ModelClass, session) => {
      ModelClass.withId(action.payload._id).update(action.payload);
    },

    [deleteItem.fulfilled.type]: (action, ModelClass, session) => {
      ModelClass.withId(action.payload).delete();
    }
  });

  // ui state reducers
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

  const initialState = {
    fetching: false,
    error: null,
    errorsById: {},
    lastFetchTime: null
  };

  const itemsSlice = createSlice({
    name: itemsTypeName,
    initialState,
    reducers: {
      removeItemError: (state, action) => {
        state.errorsById = removeErrorById(state.errorsById, action.payload);
      }
    },
    extraReducers: {
      [fetchItems.pending]: (state, action) => {
        state.fetching = true;
      },

      [fetchItems.fulfilled]: (state, action) => {
        state.fetching = false;
        state.error = null;
        state.errorsById = {};
        state.lastFetchTime = new Date().getTime();
      },

      [fetchItems.rejected]: (state, action) => {
        state.fetching = false;
        state.error = action.payload;
      },

      [addItem.fulfilled]: (state, action) => {
        state.errorsById = removeErrorById(state.errorsById, null);
      },

      [addItem.rejected]: (state, action) => {
        state.errorsById.ADD = action.payload.error;
      },

      [updateItem.fulfilled]: (state, action) => {
        state.errorsById = removeErrorById(
          state.errorsById,
          action.payload._id
        );
      },

      [updateItem.rejected]: (state, action) => {
        state.errorsById[action.payload.itemId] = action.payload.error;
      },

      [deleteItem.fulfilled]: (state, action) => {
        state.errorsById = removeErrorById(state.errorsById, action.payload);
      },

      [deleteItem.rejected]: (state, action) => {
        state.errorsById[action.payload.itemId] = action.payload.error;
      },

      resetStore: (state, action) => initialState
    }
  });

  const sliceActions = {
    removeItemError: itemsSlice.actions.removeItemError,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };

  return {
    actions: sliceActions,
    reducer: itemsSlice.reducer
  };
};
