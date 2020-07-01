import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectors as damageTypeSelectors,
  fetchDamageTypes
} from '../components/MechanicsSetup/DamageTypes/store/damageTypeSlice';

import {
  selectors as conditionSelectors,
  fetchConditions
} from '../components/MechanicsSetup/Conditions/store/conditionSlice';

import {
  selectors as featureSelectors,
  fetchFeatures
} from '../components/MechanicsSetup/Features/store/featureSlice';

const useDropdownValues = () => {
  const dispatch = useDispatch();

  const [immunities, setImmunities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [damageTypes, setDamageTypes] = useState([]);

  const allDamageTypes = useSelector(damageTypeSelectors.selectShared);
  const allConditions = useSelector(conditionSelectors.selectAll);
  const allFeatures = useSelector(featureSelectors.selectAll);
  const featureTypes = useSelector(state => featureSelectors.selectAllFeatureTypes(state, true));

  const damageTypesInitialized = useSelector(damageTypeSelectors.selectIsAllInitialized);
  const featuresInitialized = useSelector(featureSelectors.selectIsAllInitialized);
  const conditionsInitialized = useSelector(conditionSelectors.selectIsAllInitialized);

  useEffect(() => {
    Promise.all([
      dispatch(fetchDamageTypes(false)),
      dispatch(fetchDamageTypes(true)),
      dispatch(fetchConditions(true)),
      dispatch(fetchConditions(false)),
      dispatch(fetchFeatures(true)),
      dispatch(fetchFeatures(false))
    ]).then(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (conditionsInitialized && damageTypesInitialized) {
      setDamageTypes(allDamageTypes);
      setConditions(allConditions);
      setImmunities([
          { label: 'Damage Types', options: allDamageTypes },
          { label: 'Conditions', options: allConditions }
        ]);
    }
  }, [allConditions, allDamageTypes, conditionsInitialized, damageTypesInitialized]);

  useEffect(() => {
    if (featuresInitialized) {
      const groupedFeatures = [];
      const groupNames = [...featureTypes];
  
      groupNames.forEach((groupName) => {
        let groupFeatures = allFeatures.filter(
          (feature) => feature.type === groupName
        );
        if (groupFeatures.length > 0) {
          groupedFeatures.push({ label: groupName, options: groupFeatures });
        }
      });

      setFeatures(groupedFeatures);
    }
  }, [featureTypes, allFeatures, featuresInitialized])

  return [damageTypes, immunities, features, conditions]; 
};

export default useDropdownValues;
