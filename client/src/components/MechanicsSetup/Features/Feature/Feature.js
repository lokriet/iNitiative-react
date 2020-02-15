import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  faTimes,
  faCheck,
  faUndoAlt,
  faFish
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreatableSelect from 'react-select/creatable';
import { connect } from 'react-redux';

import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import SavedBadge from '../../../UI/SavedBadge/SavedBadge';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import * as actions from '../../../../store/actions/index';

import classes from './Feature.module.css';

class Feature extends Component {
  static propTypes = {
    feature: PropTypes.object,
    serverError: PropTypes.object,
    onValidateName: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func
  };

  state = {
    nameValue: this.props.feature.name,
    descriptionValue: this.props.feature.description,
    typeValue:
      this.props.feature.type == null || this.props.feature.type.length === 0
        ? null
        : { label: this.props.feature.type, value: this.props.feature.type },
    nameError: null,
    showSavedBadge: false,
    showSaveButtons: false
  };

  componentDidMount() {
    this.props.registerSaveCallback(this.props.feature._id, this.handleSave);
  }

  componentWillUnmount() {
    this.props.unregisterSaveCallback(this.props.feature._id);
  }

  setSubmitted = success => {
    if (success) {
      this.setState({ showSavedBadge: true, showSaveButtons: false });
    }
  };

  handleHideSavedBadge = () => {
    this.setState({ showSavedBadge: false });
  };

  getTypeValueValue = typeValue => {
    return typeValue == null ? null : typeValue.value;
  };

  handleNameChanged = event => {
    this.setState({ nameValue: event.target.value });

    if (
      event.target.value !== this.props.feature.name ||
      this.state.descriptionValue !== this.props.feature.description ||
      this.getTypeValueValue(this.state.typeValue) !== this.props.feature.type
    ) {
      this.setState({ showSaveButtons: true });
    } else if (!this.props.serverError) {
      this.setState({ showSaveButtons: false });
    }
  };

  handleDescriptionChanged = event => {
    this.setState({ descriptionValue: event.target.value });

    if (
      this.state.nameValue !== this.props.feature.name ||
      event.target.value !== this.props.feature.description ||
      this.getTypeValueValue(this.state.typeValue) !== this.props.feature.type
    ) {
      this.setState({ showSaveButtons: true });
    } else {
      this.setState({ showSaveButtons: false });
    }
  };

  handleTypeChanged = (newValue, action) => {
    this.setState({ typeValue: newValue });

    if (
      this.state.nameValue !== this.props.feature.name ||
      this.state.descriptionValue !== this.props.feature.description ||
      this.getTypeValueValue(newValue) !== this.props.feature.type
    ) {
      this.setState({ showSaveButtons: true });
    } else {
      this.setState({ showSaveButtons: false });
    }
  };

  handleSave = () => {
    if (!this.state.showSaveButtons) {
      return;
    }

    if (this.state.nameValue.trim() === '') {
      this.setState({ nameError: 'Name is required' });
      return;
    }
    if (
      !this.props.onValidateName(this.props.feature._id, this.state.nameValue)
    ) {
      this.setState({ nameError: 'Feature already exists' });
      return;
    }

    this.setState({ nameError: null });
    this.props.onSave(
      {
        _id: this.props.feature._id,
        name: this.state.nameValue,
        description: this.state.descriptionValue,
        type: this.getTypeValueValue(this.state.typeValue)
      },
      this.setSubmitted
    );
  };

  handleCancel = () => {
    this.setState({
      nameError: null,
      showSaveButtons: false,
      nameValue: this.props.feature.name,
      typeValue:
        this.props.feature.type == null || this.props.feature.type.length === 0
          ? null
          : { label: this.props.feature.type, value: this.props.feature.type },
      descriptionValue: this.props.feature.description
    });

    this.props.onCancel(this.props.feature._id);
  };

  render() {
    const featureTypeOptions = this.props.featureTypes.map(item => ({
      label: item,
      value: item
    }));

    return (
      <div className={classes.Feature}>
        <ItemsRow className={classes.InputFieldsRow}>
          <CreatableSelect
            options={featureTypeOptions}
            onChange={this.handleTypeChanged}
            isClearable={true}
            placeholder="Type"
            className="FeatureTypeContainer"
            classNamePrefix="FeatureType"
            value={this.state.typeValue}
          />

          <InlineInput
            hidingBorder
            type="text"
            name="name"
            placeholder="Name"
            value={this.state.nameValue}
            onChange={this.handleNameChanged}
            className={classes.Name}
          />
          <InlineInput
            hidingBorder
            className={classes.Description}
            inputType="textarea"
            name="description"
            placeholder="Description"
            value={this.state.descriptionValue}
            onChange={this.handleDescriptionChanged}
          />
          <IconButton
            icon={faTimes}
            onClick={() => this.props.onDelete(this.props.feature._id)}
          />
          {this.state.showSaveButtons ? (
            <Fragment>
              <IconButton icon={faCheck} onClick={this.handleSave} />
              <IconButton icon={faUndoAlt} onClick={this.handleCancel} />
            </Fragment>
          ) : null}
          <SavedBadge
            show={this.state.showSavedBadge}
            onHide={this.handleHideSavedBadge}
          />
        </ItemsRow>
        {this.state.nameError ? <Error>{this.state.nameError}</Error> : null}
        {this.props.serverError ? (
          <ServerValidationError serverError={this.props.serverError} />
        ) : null}
        {this.props.serverError ? (
          <ServerError serverError={this.props.serverError} />
        ) : null}

        <br />
        <FontAwesomeIcon
          icon={faFish}
          className={classes.Fish}
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faFish}
          flip={'horizontal'}
          className={classes.Fish}
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faFish}
          flip={'horizontal'}
          className={classes.Fish}
        ></FontAwesomeIcon>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    featureTypes: state.feature.featureTypes
  };
};

const mapActionsToProps = dispatch => {
  return {
    registerSaveCallback: (featureId, callback) =>
      dispatch(actions.registerSaveFeatureCallback(featureId, callback)),
    unregisterSaveCallback: featureId =>
      dispatch(actions.unregisterSaveFeatureCallback(featureId))
  };
};

export default connect(mapStateToProps, mapActionsToProps)(Feature);
