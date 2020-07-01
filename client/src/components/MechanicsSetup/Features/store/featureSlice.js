// import union from 'lodash/union';
import uniq from 'lodash/uniq';
import { createSelector } from 'redux-orm';

import { createMechanicsTypeSlice } from '../../store/mechanicsTypeSlice';
import Feature from './featureModel';
import getOrm from '../../../../store/orm/orm';

const {
  reducer,
  actions,
  selectors: featureSelectors
} = createMechanicsTypeSlice('feature', Feature);

export default reducer;

export const fetchFeatures = actions.fetchItems;
export const addFeature = actions.addItem;
export const updateFeature = actions.updateItem;
export const deleteFeature = actions.deleteItem;
export const removeFeatureError = actions.removeItemError;

const byLocale = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());

const orm = getOrm();

const selectSharedFeatureTypes = createSelector(orm, ({ Feature }) => {
  const featureTypes = Feature.all()
    .filter({ isHomebrew: false })
    .toModelArray()
    .map((feature) => feature.type);
  return uniq(featureTypes).sort(byLocale);
});

const selectAllFeatureTypes = createSelector(
  orm,
  (_, includeEmpty) => includeEmpty,
  ({ Feature }, includeEmpty) => {
    let featureTypes = Feature.all()
      .toModelArray()
      .map((feature) => feature.type);
    if (!includeEmpty) {
      featureTypes = featureTypes.filter(
        (type) => type !== null && type !== ''
      );
    }
    const result = uniq(featureTypes).sort(byLocale);
    return result;
  }
);

export const selectors = {
  ...featureSelectors,
  selectAllFeatureTypes,
  selectSharedFeatureTypes
};
