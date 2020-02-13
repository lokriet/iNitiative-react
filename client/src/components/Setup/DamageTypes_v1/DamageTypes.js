import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './DamageTypes.module.css';
import DamageType from './DamageType/DamageType';
import { useDispatch, connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import Spinner from '../../UI/Spinner/Spinner';

const DamageTypes = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.isHomebrew) {
      // TODO
    } else {
      dispatch(actions.getSharedDamageTypes());
    }
  }, [dispatch, props.isHomebrew])


  const handleSaveDamageType = useCallback(
    (values, setSubmitting) => {
      dispatch(
        actions.updateDamageType(values, props.isHomebrew, props.token, setSubmitting)
      );
    },
    [dispatch, props.token, props.isHomebrew]
  );

  const handleAddDamageType = useCallback(
    (values, setSubmitting) => {
      dispatch(
        actions.addDamageType(values, props.isHomebrew, props.token, setSubmitting)
      );
    },
    [dispatch, props.token, props.isHomebrew]
  );

  const handleCancelEdit = useCallback((damageType) => {
    dispatch(actions.removeError(damageType ? damageType._id : null));
  }, [dispatch]);

  const allDamageTypes = props.isHomebrew ? props.homebrewDamageTypes : props.sharedDamageTypes;
  let view = null;
  if (props.fetching) {
    view = <Spinner />;
  } else if (props.fetchError != null) {
    view = <div>{props.fetchError.message}</div>
  } else {
    view = (
      <div className={classes.DamageTypes}>
        <DamageType
          allDamageTypes={allDamageTypes}
          onSave={handleAddDamageType}
          onCancel={handleCancelEdit}
        />

        {allDamageTypes.map((item, index) => (
          <DamageType
            key={index}
            damageType={item}
            allDamageTypes={allDamageTypes}
            onSave={handleSaveDamageType}
            onCancel={handleCancelEdit}
          />
        ))}
      </div>
    );
  }
  return view;
};

DamageTypes.propTypes = {
  isHomebrew: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    sharedDamageTypes: state.damageType.sharedDamageTypes,
    homebrewDamageTypes: state.damageType.homebrewDamageTypes,
    fetching: state.damageType.fetching,
    fetchError: state.damageType.error
  };
};

export default connect(mapStateToProps)(DamageTypes);
