import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  faTimes,
  faCheck,
  faUndoAlt,
  faFish
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import SavedBadge from '../../../UI/SavedBadge/SavedBadge';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';

import classes from './Condition.module.css';

class Condition extends Component {
  static propTypes = {
    condition: PropTypes.object,
    serverError: PropTypes.object,
    onValidateName: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onRegisterSaveCallback: PropTypes.func.isRequired,
    onUnregisterSaveCallback: PropTypes.func.isRequired,
    onHaveUnsavedChangesStateChange: PropTypes.func.isRequired
  };

  state = {
    nameValue: this.props.condition.name,
    descriptionValue: this.props.condition.description,
    nameError: null,
    showSavedBadge: false,
    showSaveButtons: false
  };

  componentDidMount() {
    this.props.onRegisterSaveCallback(this.props.condition._id, this.handleSave);
  }

  componentWillUnmount() {
    this.props.onUnregisterSaveCallback(this.props.condition._id);
  }

  setSubmitted = success => {
    if (success) {
      this.setState({ showSavedBadge: true, showSaveButtons: false });
      this.props.onHaveUnsavedChangesStateChange(false);
    }
  };

  handleHideSavedBadge = () => {
    this.setState({ showSavedBadge: false });
  };

  handleNameChanged = event => {
    this.setState({ nameValue: event.target.value });

    if (
      event.target.value !== this.props.condition.name ||
      this.state.descriptionValue !== this.props.condition.description
    ) {
      if (!this.state.showSaveButtons) {
        this.props.onHaveUnsavedChangesStateChange(true);
      }
      this.setState({ showSaveButtons: true });
    } else if (!this.props.serverError) {
      if (this.state.showSaveButtons) {
        this.props.onHaveUnsavedChangesStateChange(false);
      }
      this.setState({ showSaveButtons: false });
    }
  };

  handleDescriptionChanged = event => {
    this.setState({ descriptionValue: event.target.value });

    if (
      this.state.nameValue !== this.props.condition.name ||
      event.target.value !== this.props.condition.description
    ) {
      if (!this.state.showSaveButtons) {
        this.props.onHaveUnsavedChangesStateChange(true);
      }
      this.setState({ showSaveButtons: true });
    } else {
      if (this.state.showSaveButtons) {
        this.props.onHaveUnsavedChangesStateChange(false);
      }
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
      !this.props.onValidateName(this.props.condition._id, this.state.nameValue)
    ) {
      this.setState({ nameError: 'Condition with this name already exists' });
      return;
    }

    this.setState({ nameError: null });
    this.props.onSave(
      {
        _id: this.props.condition._id,
        name: this.state.nameValue,
        description: this.state.descriptionValue
      },
      this.setSubmitted
    );
  };

  handleCancel = () => {
    this.setState({
      nameError: null,
      showSaveButtons: false,
      nameValue: this.props.condition.name,
      descriptionValue: this.props.condition.description
    });
    this.props.onHaveUnsavedChangesStateChange(false);

    this.props.onCancel(this.props.condition._id);
  };

  render() {
    return (
      <div className={classes.Condition}>
        <div className={classes.ConditionForm}> 
          <ItemsRow className={classes.InputFieldsRow}>
            <InlineInput
              hidingBorder
              type="text"
              name="name"
              placeholder="Name"
              value={this.state.nameValue}
              onChange={this.handleNameChanged}
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
              onClick={() => this.props.onDelete(this.props.condition._id)}
            />

            <ItemsRow className={classes.SaveButtons}>
              {this.state.showSaveButtons ? (
                <>
                  <IconButton icon={faCheck} onClick={this.handleSave} />
                  <IconButton icon={faUndoAlt} onClick={this.handleCancel} />
                </>
              ) : null}
            </ItemsRow>
          </ItemsRow>
          <SavedBadge
            show={this.state.showSavedBadge}
            onHide={this.handleHideSavedBadge}
          />
          {this.state.nameError ? <Error>{this.state.nameError}</Error> : null}
          {this.props.serverError ? (
            <ServerValidationError serverError={this.props.serverError} />
          ) : null}
          {this.props.serverError ? (
            <ServerError serverError={this.props.serverError} />
          ) : null}
        </div>

        <br />
        <ItemsRow>
          <FontAwesomeIcon
            icon={faFish}
            className={classes.Fish}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            icon={faFish}
            className={classes.Fish}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            icon={faFish}
            flip={'horizontal'}
            className={classes.Fish}
          ></FontAwesomeIcon>
        </ItemsRow>
      </div>
    );
  }
}

export default Condition;
