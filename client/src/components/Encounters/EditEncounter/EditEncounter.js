import React, { Component } from 'react';

import * as actions from '../../../store/actions';
import { connect } from 'react-redux';
import { Redirect, Prompt } from 'react-router-dom';

import Button from '../../UI/Form/Button/Button';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import ServerValidationError from '../../UI/Errors/ServerValidationError/ServerValidationError';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Spinner from '../../UI/Spinner/Spinner';
import EncounterParticipantsSelector from '../EncounterParticipantsSelector/EncounterParticipantsSelector';
import Error from '../../UI/Errors/Error/Error';

import classes from './EditEncounter.module.css';
import { isEmpty } from '../../../util/helper-methods';
import withAuthCheck from '../../../hoc/withAuthCheck';

class EditEncounter extends Component {
  state = {
    encounterName: '',
    addedParticipants: [],
    submitAttempted: false,
    validationErrors: [],
    hasUnsavedChanges: false,
    avatarUrlsToCheck: new Set(),
    initialized: false
  };

  componentDidMount = () => {
    this.props.resetEncounterOperation();

    if (!this.props.isNew) {
      this.props.getEncounterById(this.props.match.params.encounterId);
    }
  };

  componentDidUpdate = () => {
    if (this.props.editedEncounter && !this.state.initialized) {
      this.setState(prevState => {
        const newSet = new Set(prevState.avatarUrlsToCheck);
        this.props.editedEncounter.participants.forEach(item => {
          if (!isEmpty(item.avatarUrl)) {
            newSet.add(item.avatarUrl);
          }
        });

        return {
          encounterName: this.props.editedEncounter.name,
          addedParticipants: this.props.editedEncounter.participants,
          avatarUrlsToCheck: newSet,
          initialized: true
        };
      });
    }
  };

  componentWillUnmount = () => {
    if (!this.props.isNew) {
      this.props.resetEditedEncounter();
      this.props.cleanUpAvatarUrls(Array.from(this.state.avatarUrlsToCheck));
    }
  };

  handleParticipantsChanged = participants => {
    this.setState(prevState => {
      const newSet = new Set(prevState.avatarUrlsToCheck);
      participants.forEach(item => {
        if (!isEmpty(item.avatarUrl)) {
          newSet.add(item.avatarUrl);
        }
      });
      return {
        addedParticipants: participants,
        hasUnsavedChanges: true,
        avatarUrlsToCheck: newSet
      };
    });
  };

  handleNameChanged = event => {
    this.setState({ encounterName: event.target.value });
  };

  handleSaveEncounter = () => {
    let newEncounterName = this.state.encounterName.trim();
    this.setState({ encounterName: newEncounterName });

    let validationErrors = [];
    if (newEncounterName === '') {
      validationErrors.push('Encounter name should not be empty');
    }
    for (let i = 0; i < this.state.addedParticipants.length; i++) {
      const checkedParticipant = this.state.addedParticipants[i];
      if (checkedParticipant.name.trim() === '') {
        validationErrors.push(`#${i}: participant name should not be empty`);
      } else if (
        this.state.addedParticipants.some(participant => {
          return (
            ((participant._id && participant._id !== checkedParticipant._id) ||
              (participant._tempId &&
                participant._tempId !== checkedParticipant._tempId)) &&
            participant.name.trim() === checkedParticipant.name.trim()
          );
        })
      ) {
        validationErrors.push(
          `${checkedParticipant.name}: participant with this name already exists in the encounter`
        );
      }

      if (
        checkedParticipant.rolledInitiative != null &&
        checkedParticipant.rolledInitiative !== ''
      ) {
        let ini = parseFloat(checkedParticipant.rolledInitiative);
        if (ini < 1 || ini > 20) {
          const name =
            checkedParticipant.name != null &&
            checkedParticipant.name.trim() !== ''
              ? checkedParticipant.name
              : `#${i}`;
          validationErrors.push(
            `${name}: rolled initiative should be between 1 and 20`
          );
        }
      }
    }

    this.setState({ validationErrors });
    if (validationErrors.length > 0) {
      return;
    }

    this.setState({ submitAttempted: true });
    const participantsToSave = this.state.addedParticipants.map(participant => {
      let newParticipant = { ...participant };
      delete newParticipant._tempId;
      return newParticipant;
    });

    if (!this.props.isNew) {
      this.props.editEncounter(this.props.match.params.encounterId, {
        _id: this.props.match.params.encounterId,
        name: this.state.encounterName,
        participants: participantsToSave
      });
    } else {
      this.props.editEncounter(null, {
        name: this.state.encounterName,
        participants: participantsToSave
      });
    }
  };

  render() {
    let view;
    if (this.state.submitAttempted && this.props.saveSuccess) {
      view = <Redirect to="/encounters" />;
    } else if (!this.props.isNew && this.props.fetchingEncounterError) {
      view = <ServerError serverError={this.props.fetchingEncounterError} />;
    } else if (!this.props.isNew && !this.props.editedEncounter) {
      view = <Spinner />;
    } else {
      view = (
        <div className={classes.Container}>
          <Prompt
            when={
              !this.props.isNew &&
              (this.state.hasUnsavedChanges ||
                this.state.encounterName !== this.props.editedEncounter.name)
            }
            message="Confirm leaving the page? All unsaved changes will be lost. "
          />
          <input
            placeholder="Give it a name!"
            className={classes.EncounterName}
            value={this.state.encounterName}
            onChange={this.handleNameChanged}
          />
          <ItemsRow>
            <Button type="button" onClick={this.props.history.goBack}>
              Cancel
            </Button>
            <Button onClick={this.handleSaveEncounter}>Save</Button>
          </ItemsRow>

          <div className={classes.Errors}>
            {this.state.validationErrors.map((error, index) => (
              <Error key={index}>{error}</Error>
            ))}
            {this.props.saveError ? (
              <div>
                <ServerValidationError
                  serverError={this.props.saveError}
                  for="name"
                />
                <ServerError serverError={this.props.saveError} />
              </div>
            ) : null}
          </div>

          <div className={classes.ParticipantsSelector}>
            <EncounterParticipantsSelector
              participants={
                !this.props.isNew ? this.props.editedEncounter.participants : []
              }
              onParticipantsChanged={this.handleParticipantsChanged}
            />
          </div>
        </div>
      );
    }

    return view;
  }
}

const mapStateToProps = state => {
  return {
    saveError: state.encounter.operationError,
    saveSuccess: state.encounter.operationSuccess,
    editedEncounter: state.encounter.editedEncounter,
    fetchingEncounterError: state.encounter.fetchingError
  };
};

const mapActionsToProps = dispatch => {
  return {
    resetEditedEncounter: () => dispatch(actions.resetEditedEncounter()),
    resetEncounterOperation: () => dispatch(actions.resetEncounterOperation()),
    getEncounterById: encounterId =>
      dispatch(actions.getEncounterById(encounterId)),
    editEncounter: (encounterId, partialUpdate) =>
      dispatch(actions.editEncounter(encounterId, partialUpdate)),
    cleanUpAvatarUrls: avatarUrls =>
      dispatch(actions.cleanUpAvatarUrls(avatarUrls))
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withAuthCheck(EditEncounter));
