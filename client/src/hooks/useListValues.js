import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/actions';

const useListValues = () => {
  const dispatch = useDispatch();

  const [immunities, setImmunities] = useState([]);
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

  useEffect(() => {
    dispatch(actions.getSharedDamageTypes());
    dispatch(actions.getHomebrewDamageTypes());
    dispatch(actions.getSharedConditions());
    dispatch(actions.getHomebrewConditions());
    dispatch(actions.getSharedFeatures());
    dispatch(actions.getHomebrewFeatures());
  }, [dispatch]);

  useEffect(() => {
    const damageTypes = [
      ...sharedDamageTypes,
      ...homebrewDamageTypes
    ];
    const conditions = [
      ...sharedConditions,
      ...homebrewConditions
    ];

    setImmunities([
      ...damageTypes, ...conditions
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
    setFeatures([...homebrewFeatures, ...sharedFeatures]);
  }, [sharedFeatures, homebrewFeatures]);

  return [damageTypes, immunities, features, conditions];
};

export default useListValues;
