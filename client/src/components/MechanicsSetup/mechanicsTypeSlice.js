import { combineReducers } from '@reduxjs/toolkit';
import { createItemsSlice } from './itemsSlice';
import { itemsApi } from '../../api/itemsApi';

export const createMechanicsTypeSlice = (typeName) => {
  const homebrewSlice = createItemsSlice(
    'homebrew',
    `${typeName}.homebrew`,
    itemsApi(typeName, true)
  );
  const sharedSlice = createItemsSlice(
    'shared',
    `${typeName}.shared`,
    itemsApi(typeName, false)
  );

  const reducer = combineReducers({
    homebrew: homebrewSlice.reducer,
    shared: sharedSlice.reducer
  });

  const fetchItems = (isHomebrew) =>
    isHomebrew
      ? homebrewSlice.actions.fetchItems()
      : sharedSlice.actions.fetchItems();

  const addItem = (item, isHomebrew, onOperationDone) =>
    isHomebrew
      ? homebrewSlice.actions.addItem({ item, onOperationDone })
      : sharedSlice.actions.addItem({ item, onOperationDone });

  const updateItem = (item, isHomebrew, onOperationDone) =>
    isHomebrew
      ? homebrewSlice.actions.updateItem({ item, onOperationDone })
      : sharedSlice.actions.updateItem({ item, onOperationDone });

  const deleteItem = (itemId, isHomebrew) =>
    isHomebrew
      ? homebrewSlice.actions.deleteItem({ itemId })
      : sharedSlice.actions.deleteItem({ itemId });

  const removeItemError = (itemId, isHomebrew) => async (dispatch) => {
    isHomebrew
      ? dispatch(homebrewSlice.actions.removeItemError(itemId))
      : dispatch(sharedSlice.actions.removeItemError(itemId));
  };

  const selectors = {
    homebrew: homebrewSlice.selector,
    shared: sharedSlice.selector
  };

  const actions = {
    removeItemError,
    deleteItem,
    updateItem,
    addItem,
    fetchItems
  };

  return { selectors, actions, reducer };
};
