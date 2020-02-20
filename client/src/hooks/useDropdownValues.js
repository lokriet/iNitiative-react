import { useEffect, useState, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/actions';

const useDropdownValues = () => {
  const dispatch = useDispatch();

  // const [vulnerabilities, setVulnerabilities] = useState([]);
  const [immunities, setImmunities] = useState([]);
  // const [resistances, setResistances] = useState([]);
  const [features, setFeatures] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [damageTypes, setDamageTypes] = useState([]);

  const sharedDamageTypes = useSelector(
    state => state.damageType.sharedDamageTypes
  );
  const homebrewDamageTypes = useSelector(
    state => state.damageType.homebrewDamageTypes
  );
  const sharedConditions = useSelector(
    state => state.condition.sharedConditions
  );
  const homebrewConditions = useSelector(
    state => state.condition.homebrewConditions
  );
  const sharedFeatures = useSelector(state => state.feature.sharedFeatures);
  const homebrewFeatures = useSelector(state => state.feature.homebrewFeatures);
  const featureTypes = useSelector(state => state.feature.featureTypes);

  useEffect(() => {
    dispatch(actions.getSharedDamageTypes());
    dispatch(actions.getHomebrewDamageTypes());
    dispatch(actions.getSharedConditions());
    dispatch(actions.getHomebrewConditions());
    dispatch(actions.getSharedFeatures());
    dispatch(actions.getHomebrewFeatures());
  }, [dispatch]);

  const makeSortedOptionsList = useCallback(items => {
    return items
      .map(item => ({ label: item.name, value: item._id }))
      .sort((a, b) =>
        a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      );
  }, []);

  useEffect(() => {
    const damageTypes = makeSortedOptionsList([
      ...sharedDamageTypes,
      ...homebrewDamageTypes
    ]);
    const conditions = makeSortedOptionsList([
      ...sharedConditions,
      ...homebrewConditions
    ]);

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
    homebrewConditions,
    makeSortedOptionsList
  ]);

  useEffect(() => {
    const features = [...homebrewFeatures, ...sharedFeatures].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    const groupedFeatures = [];
    const groupNames = ['', ...featureTypes];
    groupNames.forEach(groupName => {
      let groupFeatures = features.filter(
        feature => feature.type === groupName
      );
      if (groupFeatures.length > 0) {
        const options = groupFeatures.map(feature => ({label: feature.name, value: feature._id}));
        groupedFeatures.push({ label: groupName, options });
      }
    });
    setFeatures(groupedFeatures);
  }, [sharedFeatures, homebrewFeatures, featureTypes]);

  return [damageTypes, immunities, features, conditions];
};

export default useDropdownValues;
