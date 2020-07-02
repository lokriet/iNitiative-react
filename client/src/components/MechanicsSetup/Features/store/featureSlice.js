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

const selectSharedFeatureTypes = createSelector(
  orm,
  featureSelectors.selectShared,
  (session, sharedFeatures) => uniq(sharedFeatures.map(feature => feature.type)).sort(byLocale)
)


const selectAllFeatureTypes = createSelector(
  orm,
  featureSelectors.selectAll,
  (_, includeEmpty) => includeEmpty,
  (session, allFeatures, includeEmpty) => {
    let featureTypes = uniq(allFeatures.map(feature => feature.type)).sort(byLocale);
    if (!includeEmpty) {
      featureTypes = featureTypes.filter(type => type != null && type !== '');
    }
    return featureTypes;
  }
)

export const selectors = {
  ...featureSelectors,
  selectAllFeatureTypes,
  selectSharedFeatureTypes
};
