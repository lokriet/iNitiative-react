import { createMechanicsTypeSlice } from '../../store/mechanicsTypeSlice';

const { reducer, actions, selectors } = createMechanicsTypeSlice('condition');

export default reducer;

export const fetchConditions = actions.fetchItems;
export const addCondition = actions.addItem;
export const updateCondition = actions.updateItem;
export const deleteCondition = actions.deleteItem;
export const removeConditionError = actions.removeItemError;

export {selectors};