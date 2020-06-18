const { createMechanicsTypeSlice } = require('../mechanicsTypeSlice');

const { reducer, actions, selectors } = createMechanicsTypeSlice('damageType');

export default reducer;

export const fetchDamageTypes = actions.fetchItems;
export const addDamageType = actions.addItem;
export const updateDamageType = actions.updateItem;
export const deleteDamageType = actions.deleteItem;
export const removeDamageTypeError = actions.removeItemError;

export {selectors};