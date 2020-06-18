import union from 'lodash/union';

const { createMechanicsTypeSlice } = require('../mechanicsTypeSlice');

const {
  reducer,
  actions,
  selectors: featureSelectors
} = createMechanicsTypeSlice('feature');

export default reducer;

export const fetchFeatures = actions.fetchItems;
export const addFeature = actions.addItem;
export const updateFeature = actions.updateItem;
export const deleteFeature = actions.deleteItem;
export const removeFeatureError = actions.removeItemError;

const selectHomebrewFeatureTypes = (featureState) =>
  union(
    featureSelectors.homebrew
      .selectAll(featureState.homebrew)
      .map((feature) => feature.type)
  );
const selectSharedFeatureTypes = (featureState) =>
  union(
    featureSelectors.shared
      .selectAll(featureState.shared)
      .map((feature) => feature.type)
  );
const selectAllFeatureTypes = (featureState) =>
  union(
    featureSelectors.homebrew
      .selectAll(featureState.homebrew)
      .map((feature) => feature.type),
    featureSelectors.shared
      .selectAll(featureState.shared)
      .map((feature) => feature.type)
  );

export const selectors = {
  common: {
    selectAllFeatureTypes,
    selectSharedFeatureTypes,
    selectHomebrewFeatureTypes
  },
  homebrew: featureSelectors.homebrew,
  shared: featureSelectors.shared
};
