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

const byName = (a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase());

const useDropdownValues = () => {
  const dispatch = useDispatch();

  const [immunities, setImmunities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [damageTypes, setDamageTypes] = useState([]);

  const sharedDamageTypes = useSelector((state) =>
    damageTypeSelectors.shared.selectAll(state.damageType.shared)
  );
  const homebrewDamageTypes = useSelector((state) =>
    damageTypeSelectors.homebrew.selectAll(state.damageType.homebrew)
  );

  const sharedConditions = useSelector((state) =>
    conditionSelectors.shared.selectAll(state.condition.shared)
  );
  const homebrewConditions = useSelector((state) =>
    conditionSelectors.homebrew.selectAll(state.condition.homebrew)
  );

  const sharedFeatures = useSelector((state) =>
    featureSelectors.shared.selectAll(state.feature.shared)
  );
  const homebrewFeatures = useSelector((state) =>
    featureSelectors.homebrew.selectAll(state.feature.homebrew)
  );

  const featureTypes = useSelector(featureSelectors.common.selectAllFeatureTypes);

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
    const newConditions = [...sharedConditions, ...homebrewConditions].sort(byName);
    const newDamageTypes = [...sharedDamageTypes, ...homebrewDamageTypes].sort(byName);
    setDamageTypes(newDamageTypes);
    setConditions(newConditions);
    setImmunities([
        { label: 'Damage Types', options: newDamageTypes },
        { label: 'Conditions', options: newConditions }
      ]);
  }, [sharedConditions, homebrewConditions, sharedDamageTypes, homebrewDamageTypes]);

  useEffect(() => {
    const newFeatures = [...homebrewFeatures, ...sharedFeatures].sort(byName);

    const groupedFeatures = [];
    const groupNames = ['', ...featureTypes];

    groupNames.forEach((groupName) => {
      let groupFeatures = newFeatures.filter(
        (feature) => feature.type === groupName
      );
      if (groupFeatures.length > 0) {
        groupedFeatures.push({ label: groupName, options: groupFeatures });
      }
    });
    setFeatures(groupedFeatures);
  }, [featureTypes, homebrewFeatures, sharedFeatures])

  return [damageTypes, immunities, features, conditions]; 
};

export default useDropdownValues;
