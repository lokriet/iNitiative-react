import React from 'react';
import PropTypes from 'prop-types';
import classes from './MapAvatar.module.css';
import { isEmpty } from '../../../../../../util/helper-methods';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull } from '@fortawesome/free-solid-svg-icons';

const MapAvatar = ({ participant, width, height, className }) => {
  return (
    <div
      className={`${classes.Avatar} ${
        isEmpty(participant.avatarUrl) ? classes.FirstLetter : ''
      } ${className || ''}`}
      style={{
        backgroundColor:
          isEmpty(participant.color) || isEmpty(participant.avatarUrl)
            ? 'white'
            : participant.color,

        borderColor: isEmpty(participant.color)
          ? 'transparent'
          : participant.color,

        backgroundImage: isEmpty(participant.avatarUrl)
          ? 'unset'
          : `url(${participant.avatarUrl})`,

        fontSize: `${0.8 * Math.min(parseFloat(width), parseFloat(height))}${
          width.endsWith('rem') ? 'rem' : 'px'
        }`,
        width,
        height
      }}
    >
      {isEmpty(participant.avatarUrl)
        ? participant.name.substring(0, 1).toUpperCase()
        : null}

      {participant.currentHp <= 0 ? (
        <div className={classes.DeadIcon}>
          <FontAwesomeIcon icon={faSkull} />
        </div>
      ) : null}
    </div>
  );
};

MapAvatar.propTypes = {
  participant: PropTypes.object.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string
};

export default MapAvatar;
