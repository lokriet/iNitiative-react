import React from 'react';
import PropTypes from 'prop-types';

import ItemsRow from '../../../../../UI/ItemsRow/ItemsRow';
import List from '../../../../../UI/Table/List/List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFish } from '@fortawesome/free-solid-svg-icons';

import classes from './TemplateDetailsPopup.module.css';


const TemplateDetailsPopup = ({ template }) => {
  return (
    <div className={classes.Container}>
      <ItemsRow className={classes.NameRow}>
        {template.avatarUrl ? (
          <img
            className={classes.Avatar}
            src={template.avatarUrl}
            alt={template.name}
          />
        ) : null}
        <div className={classes.Name}>{template.name}</div>
      </ItemsRow>
      <ItemsRow>
        <div className={classes.DetailsColumn}>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Ini Mod:</label>
            <div>{template.initiativeModifier}</div>
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Max HP:</label>
            <div>{template.maxHp}</div>
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Map Size:</label>
            <div>{template.mapSize}</div>
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Comment</label>
            <div>{template.comment == null || template.comment === '' ? '-' : template.comment}</div>
          </ItemsRow>
        </div>
        <div className={classes.DetailsColumn}>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Armor Class:</label>
            <div>{template.armorClass}</div>
          </ItemsRow>
          <ItemsRow>
            <label className={classes.DetailsLabel}>Speed:</label>
            <div>{template.speed}</div>
          </ItemsRow>
          <ItemsRow className={classes.ExtraSpeeds}>
            {template.swimSpeed == null ? null : (
              <div>Swim: {template.swimSpeed}</div>
            )}
            {template.climbSpeed == null ? null : (
              <div>Climb: {template.climbSpeed}</div>
            )}
            {template.flySpeed == null ? null : (
              <div>Fly: {template.flySpeed}</div>
            )}
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
              <List items={template.immunities.damageTypes} />
              {template.immunities.damageTypes.length > 0 &&
              template.immunities.conditions.length > 0 ? (
                <div className={classes.Separator}>&nbsp;&nbsp;&mdash;</div>
              ) : null}
              <List items={template.immunities.conditions} />
              {template.immunities.damageTypes.length === 0 &&
              template.immunities.conditions.length === 0
                ? '—'
                : null}
            </div>
          </div>
          <div className={classes.DetailsList}>
            <label className={classes.DetailsLabel}>Resistances:</label>
            <div>
              <List items={template.resistances} />
              {template.resistances.length === 0 ? '—' : null}
            </div>
          </div>
        </div>
        <div className={classes.DetailsColumn}>
          <div className={classes.DetailsList}>
            <label className={classes.DetailsLabel}>Vulnerabilities:</label>
            <div>
              <List items={template.vulnerabilities} />
              {template.vulnerabilities.length === 0 ? '—' : null}
            </div>
          </div>
          <div className={classes.DetailsList}>
            <label className={classes.DetailsLabel}>Features:</label>
            <div>
              <List items={template.features} />
              {template.features.length === 0 ? '—' : null}
            </div>
          </div>
        </div>
      </ItemsRow>
    </div>
  );
};

TemplateDetailsPopup.propTypes = {
  template: PropTypes.object.isRequired
};

export default TemplateDetailsPopup;
