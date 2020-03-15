import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AreaEffects = ({ gridCellSize }) => {
  return <div></div>;
};

AreaEffects.propTypes = {
  gridCellSize: PropTypes.object
};

const mapStateToProps = state => {
  return {
    editedEncounter: state.encounter.editedEncounter
  };
};

export default connect(mapStateToProps)(AreaEffects);
