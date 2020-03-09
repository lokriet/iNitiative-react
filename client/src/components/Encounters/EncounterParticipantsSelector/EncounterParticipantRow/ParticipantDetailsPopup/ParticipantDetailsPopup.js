import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFish } from '@fortawesome/free-solid-svg-icons';

import ItemsRow from '../../../../UI/ItemsRow/ItemsRow';
import List from '../../../../UI/Table/List/List';
import Color from '../../../../UI/Color/Color';

import classes from './ParticipantDetailsPopup.module.css';

const ParticipantDetailsPopup = ({ participant }) => {
  return (
    <div className={classes.Container}>
      <ItemsRow className={classes.NameRow}>
        {participant.avatarUrl ? (
          <img
            className={classes.Avatar}
            style={participant.color == null ? {} : {borderColor: participant.color}}
            src={participant.avatarUrl}
            alt={participant.name}
          />
        ) : participant.color == null ? null : <Color className={classes.ColorDot} color={participant.color} /> }
        <div className={classes.Name}>{participant.name}</div>
      </ItemsRow>
      <ItemsRow>
        <div className={classes.DetailsColumn}>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Ini:</label>
            <div>
              {(participant.rolledInitiative || 0) +
                participant.initiativeModifier}{' '}
              ({participant.rolledInitiative == null ? '-' : participant.rolledInitiative} + {participant.initiativeModifier}
              )
            </div>
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>HP:</label>
            <div>
              {participant.currentHp}/{participant.maxHp} [
              {participant.temporaryHp == null ? '-' : participant.temporaryHp}]
            </div>
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Map Size:</label>
            <div>{participant.mapSize}</div>
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Comment</label>
            <div>{participant.comment == null || participant.comment === '' ? '-' : participant.comment}</div>
          </ItemsRow>
        </div>
        <div className={classes.DetailsColumn}>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Armor Class:</label>
              <div>{participant.armorClass} {participant.temporaryArmorClass == null ? '' : 'Tmp ' + participant.temporaryArmorClass}</div>
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Speed:</label>
            <div>{participant.speed} {participant.temporarySpeed == null ? '' : 'Tmp ' + participant.temporarySpeed}</div>
          </ItemsRow>
          <ItemsRow className={classes.ExtraSpeeds}>
            {participant.swimSpeed == null ? null : (
              <div>Swim: {participant.swimSpeed} {participant.temporarySwimSpeed == null ? '' : 'Tmp ' + participant.temporarySwimSpeed}</div>
            )}
            {participant.climbSpeed == null ? null : (
              <div>Climb: {participant.climbSpeed} {participant.temporaryClimbSpeed == null ? '' : 'Tmp ' + participant.temporaryClimbSpeed}</div>
            )}
            {participant.flySpeed == null ? null : (
              <div>Fly: {participant.flySpeed} {participant.temporaryFlySpeed == null ? '' : 'Tmp ' + participant.temporaryFlySpeed}</div>
            )}
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Advantages:</label>
            <div>{participant.advantages == null || participant.advantages === '' ? '-' : participant.advantages}</div>
          </ItemsRow>
        </div>
      </ItemsRow>
      <ItemsRow centered className={classes.Fish}>
        <FontAwesomeIcon icon={faFish} />
        <FontAwesomeIcon icon={faFish} flip={'horizontal'} />
      </ItemsRow>
      <ItemsRow>
        <div className={classes.DetailsColumn}>
          <div className={classes.DetailsList}>
            <label className={classes.DetailsLabel}>Immunities:</label>
            <div>
              <List items={participant.immunities.damageTypes} />
              {participant.immunities.damageTypes.length > 0 &&
              participant.immunities.conditions.length > 0 ? (
                <div className={classes.Separator}>&nbsp;&nbsp;&mdash;</div>
              ) : null}
              <List items={participant.immunities.conditions} />
              {participant.immunities.damageTypes.length === 0 &&
              participant.immunities.conditions.length === 0
                ? '—'
                : null}
            </div>
          </div>
          <div className={classes.DetailsList}>
            <label className={classes.DetailsLabel}>Resistances:</label>
            <div>
              <List items={participant.resistances} />
              {participant.resistances.length === 0 ? '—' : null}
            </div>
          </div>
        </div>
        <div className={classes.DetailsColumn}>
          <div className={classes.DetailsList}>
            <label className={classes.DetailsLabel}>Vulnerabilities:</label>
            <div>
              <List items={participant.vulnerabilities} />
              {participant.vulnerabilities.length === 0 ? '—' : null}
            </div>
          </div>
          <div className={classes.DetailsList}>
            <label className={classes.DetailsLabel}>Features:</label>
            <div>
              <List items={participant.features} />
              {participant.features.length === 0 ? '—' : null}
            </div>
          </div>
        </div>
      </ItemsRow>
    </div>
  );
};

ParticipantDetailsPopup.propTypes = {
  participant: PropTypes.object.isRequired
};

export default ParticipantDetailsPopup;
