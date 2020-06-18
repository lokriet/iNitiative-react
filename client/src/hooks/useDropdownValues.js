import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchConditions,
  selectors as conditionSelectors
} from '../components/MechanicsSetup/Conditions/conditionSlice';
import {
  fetchDamageTypes,
  selectors as damageTypeSelectors
} from '../components/MechanicsSetup/DamageTypes/damageTypeSlice';
import {
  fetchFeatures,
  selectors as featureSelectors
} from '../components/MechanicsSetup/Features/featureSlice';

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
  const featureTypes = useSelector((state) =>
    featureSelectors.common.selectAllFeatureTypes(state.feature)
  );

  useEffect(() => {
    dispatch(fetchDamageTypes(true));
    dispatch(fetchDamageTypes(false));
    dispatch(fetchConditions(true));
    dispatch(fetchConditions(false));
    dispatch(fetchFeatures(true));
    dispatch(fetchFeatures(false));
  }, [dispatch]);

  useEffect(() => {
    const damageTypes = [
      ...sharedDamageTypes,
      ...homebrewDamageTypes
    ].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    const conditions = [
      ...sharedConditions,
      ...homebrewConditions
    ].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    setImmunities([
      { label: 'Damage Types', options: damageTypes },
      { label: 'Conditions', options: conditions }
    ]);

    setConditions(conditions);
    setDamageTypes(damageTypes);
  }, [
    sharedDamageTypes,
    homebrewDamageTypes,
    sharedConditions,
    homebrewConditions
  ]);

  useEffect(() => {
    const features = [...homebrewFeatures, ...sharedFeatures].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    const groupedFeatures = [];
    const groupNames = ['', ...featureTypes];
    groupNames.forEach((groupName) => {
      let groupFeatures = features.filter(
        (feature) => feature.type === groupName
      );
      if (groupFeatures.length > 0) {
        groupedFeatures.push({ label: groupName, options: groupFeatures });
      }
    });
    setFeatures(groupedFeatures);
  }, [sharedFeatures, homebrewFeatures, featureTypes]);

  return [damageTypes, immunities, features, conditions];
};

export default useDropdownValues;
