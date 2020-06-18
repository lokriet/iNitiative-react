import union from 'lodash/union';
import uniq from 'lodash/uniq';
import { createSelector } from '@reduxjs/toolkit';

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

const byLocale = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());

const homebrewFeaturesSelector = (state) =>
  featureSelectors.homebrew.selectAll(state.feature.homebrew);
const sharedFeaturesSelector = (state) =>
  featureSelectors.shared.selectAll(state.feature.shared);

const selectHomebrewFeatureTypes = createSelector(
  [homebrewFeaturesSelector],
  (homebrewFeatures) => uniq(homebrewFeatures.map((feature) => feature.type)).sort(byLocale)
);

const selectSharedFeatureTypes = createSelector(
  [sharedFeaturesSelector],
  (sharedFeatures) => uniq(sharedFeatures.map((feature) => feature.type)).sort(byLocale)
);

const selectAllFeatureTypes = createSelector(
  [homebrewFeaturesSelector, sharedFeaturesSelector],
  (homebrewFeatures, sharedFeatures) =>
    union(
      homebrewFeatures.map((feature) => feature.type),
      sharedFeatures.map((feature) => feature.type)
    ).sort(byLocale)
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
