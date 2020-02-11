import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classes from './DamageTypes.module.css';
import DamageType from './DamageType/DamageType';

const DamageTypes = props => {
  const damageType = { name: 'Poison', description: 'Poisonous', _id: '1' };
  const damageType2 = {
    name: 'Poison2',
    description: 'Poisonous too',
    _id: '2'
  };
  const [allDamageTypes, setAllDamageTypes] = useState([damageType, damageType2]);

  const saveDamageTypeHandler = useCallback(
    (values, setSubmitting) => {
      console.log('updating damage type', values);

      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          setAllDamageTypes(allDamageTypes.map(item => item._id === values._id ? values : item));
          resolve(true);
        }, 1000);
      });

      promise.then(result => {
        setSubmitting(false);
      });

    },
    [allDamageTypes]
  );

  const addDamageTypeHandler = useCallback(
    (values, setSubmitting) => {
      // const promise = new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     const newItem = { ...values, _id: allDamageTypes.length.toString() };
      //     setAllDamageTypes(allDamageTypes.concat(newItem));
      //     resolve(true);
      //   }, 1000);
      // });

      // promise.then(result => {
      //   setSubmitting(false);
      //   return result;
      // });

    },
    [allDamageTypes]
  );

  // const 

  return (
    <div className={classes.DamageTypes}>
      <DamageType
        allDamageTypes={allDamageTypes}
        onSave={addDamageTypeHandler}
      />

      {allDamageTypes.map((item, index) => (
        <DamageType
          key={index}
          damageType={item}
          allDamageTypes={allDamageTypes}
          onSave={saveDamageTypeHandler}
        />
      ))}
    </div>
  );
};

DamageTypes.propTypes = {};

export default DamageTypes;
