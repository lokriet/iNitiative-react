import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { faTimes, faCheck, faUndoAlt, faFish } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InlineInput from '../../../UI/Form/InlineInput/InlineInput';
import IconButton from '../../../UI/Form/IconButton/IconButton';
import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import SavedBadge from '../../../UI/SavedBadge/SavedBadge';

import classes from './Condition.module.css';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import * as actions from '../../../../store/actions/index';
import { connect } from 'react-redux';

class Condition extends Component {
  static propTypes = {
    condition: PropTypes.object,
    serverError: PropTypes.object,
    onValidateName: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func
  };

  state = {
    nameValue: this.props.condition.name,
    descriptionValue: this.props.condition.description,
    nameError: null,
    showSavedBadge: false,
    showSaveButtons: false
  };

  componentDidMount() {
    this.props.registerSaveCallback(this.props.condition._id, this.handleSave);
  }

  componentWillUnmount() {
    this.props.unregisterSaveCallback(this.props.condition._id);
  }

  setSubmitted = success => {
    if (success) {
      this.setState({ showSavedBadge: true, showSaveButtons: false });
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
      this.setState({ showSaveButtons: true });
    } else if (!this.props.serverError) {
      this.setState({ showSaveButtons: false });
    }
  };

  handleDescriptionChanged = event => {
    this.setState({ descriptionValue: event.target.value });

    if (
      this.state.nameValue !== this.props.condition.name ||
      event.target.value !== this.props.condition.description
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
      !this.props.onValidateName(this.props.condition._id, this.state.nameValue)
    ) {
      this.setState({ nameError: 'Condition already exists' });
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

    this.props.onCancel(this.props.condition._id);
  };

  render() {
    return (
      <div className={classes.Condition}>
        <ItemsRow>
          <InlineInput
            type="text"
            name="name"
            placeholder="Name"
            value={this.state.nameValue}
            onChange={this.handleNameChanged}
          />
          <InlineInput
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
        <FontAwesomeIcon icon={faFish} className={classes.Fish}></FontAwesomeIcon>
        <FontAwesomeIcon icon={faFish} className={classes.Fish}></FontAwesomeIcon>
        <FontAwesomeIcon icon={faFish} flip={'horizontal'} className={classes.Fish}></FontAwesomeIcon>
      </div>
    );
  }
}

const mapActionsToProps = dispatch => {
  return {
    registerSaveCallback: (conditionId, callback) => dispatch(actions.registerSaveCallback(conditionId, callback)),
    unregisterSaveCallback: (conditionId) => dispatch(actions.unregisterSaveCallback(conditionId))
  }
}

export default connect(null, mapActionsToProps)(Condition);
