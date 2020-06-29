import { createItemsSlice } from './itemsSlice';
import { combineReducers } from 'redux';
import { createSelector } from 'redux-orm';
import getOrm from '../../../store/orm/orm';
import { capitalize } from '../../../util/helper-methods';

export const createMechanicsTypeSlice = (typeName, ModelClass) => {
  const homebrewSlice = createItemsSlice(typeName, ModelClass, true);
  const sharedSlice = createItemsSlice(typeName, ModelClass, false);

  const reducer = combineReducers({
    homebrew: homebrewSlice.reducer,
    shared: sharedSlice.reducer
  });

  // async actions
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

  const actions = {
    removeItemError,
    deleteItem,
    updateItem,
    addItem,
    fetchItems
  };

  // selectors
  const orm = getOrm();
  const modelName = capitalize(typeName);
  const selectAll = createSelector(orm, (session) =>
    session[modelName].orderBy((item) => item.name.toLowerCase()).toRefArray()
  );

  const selectHomebrew = createSelector(orm, (session) =>
    session[modelName]
      .filter((damageType) => damageType.isHomebrew)
      .orderBy((item) => item.name.toLowerCase())
      .toRefArray()
  );

  const selectShared = createSelector(orm, (session) =>
    session[modelName]
      .filter((damageType) => !damageType.isHomebrew)
      .orderBy((item) => item.name.toLowerCase())
      .toRefArray()
  );

  const selectors = {
    selectAll,
    selectHomebrew,
    selectShared
  };

  return { selectors, actions, reducer };
};
