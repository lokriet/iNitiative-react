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

  const addItem = (item, isHomebrew, setSubmitted) =>
    isHomebrew
      ? homebrewSlice.actions.addItem({ item, setSubmitted })
      : sharedSlice.actions.addItem({ item, setSubmitted });

  const updateItem = (item, isHomebrew, setSubmitted) =>
    isHomebrew
      ? homebrewSlice.actions.updateItem({ item, setSubmitted })
      : sharedSlice.actions.updateItem({ item, setSubmitted });

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
