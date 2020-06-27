import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './MapControls.module.css';
import TabButton from '../../../../../UI/Form/Button/TabButton/TabButton';
import ItemsRow from '../../../../../UI/ItemsRow/ItemsRow';
import AddMapParticipant from '../AddMapParticipant/AddMapParticipant';
import { useSelector } from 'react-redux';
import MapSettings from './MapSettings/MapSettings';
import AreaEffectsSetup from '../AreaEffects/AreaEffectsSetup/AreaEffectsSetup';
import { selectEditedEncounter } from '../../../../store/encounterSlice';

const ControlsView = {
  Settings: 'settings',
  Participants: 'participants',
  AoE: 'aoe'
};

const MapControls = ({
  onNewParticipantDropped,
  onMapSettingsChanged,

  editedAreaEffect,
  onAreaEffectSaved,
  onAreaEffectChanged,
  onAreaEffectDeleted
}) => {
  const [selectedView, setSelectedView] = useState(null);
  const editedEncounter = useSelector(selectEditedEncounter);

  const onSwitchView = useCallback(
    view => {
      if (view === selectedView) {
        setSelectedView(null);
      } else {
        setSelectedView(view);
      }
    },
    [selectedView]
  );

  return (
    <div className={classes.MapControls}>
      <div className={classes.ControlTabs}>
        <TabButton
          isActive={selectedView === ControlsView.Participants}
          onClick={() => onSwitchView(ControlsView.Participants)}
        >
          Participants
        </TabButton>
        <TabButton
          isActive={selectedView === ControlsView.AoE}
          onClick={() => onSwitchView(ControlsView.AoE)}
        >
          Area effects
        </TabButton>
        <TabButton
          isActive={selectedView === ControlsView.Settings}
          onClick={() => onSwitchView(ControlsView.Settings)}
        >
          Map settings
        </TabButton>
      </div>

      <div className={classes.ControlsContainer}>
        {selectedView === ControlsView.Participants ? (
          <ItemsRow className={classes.Participants}>
            {editedEncounter.participants.map(participant => (
              <AddMapParticipant
                key={participant._id}
                participant={participant}
                isOnMap={editedEncounter.map.participantCoordinates.some(
                  coordinate =>
                    coordinate.participantId.toString() ===
                    participant._id.toString()
                )}
                onDropped={(mouseEvent, position) =>
                  onNewParticipantDropped(participant, mouseEvent, position)
                }
              />
            ))}
          </ItemsRow>
        ) : null}

        {selectedView === ControlsView.Settings ? (
          <MapSettings onSettingsChanged={onMapSettingsChanged} />
        ) : null}

        {selectedView === ControlsView.AoE ? (
          <AreaEffectsSetup
            editedAreaEffect={editedAreaEffect}
            onAreaEffectSaved={onAreaEffectSaved}
            onAreaEffectChanged={onAreaEffectChanged}
            onAreaEffectDeleted={onAreaEffectDeleted}
          />
        ) : null}
      </div>
    </div>
  );
};

MapControls.propTypes = {
  onNewParticipantDropped: PropTypes.func.isRequired,
  onMapSettingsChanged: PropTypes.func.isRequired,

  editedAreaEffect: PropTypes.object,
  onAreaEffectChanged: PropTypes.func.isRequired,
  onAreaEffectSaved: PropTypes.func.isRequired,
  onAreaEffectDeleted: PropTypes.func.isRequired
};

export default MapControls;
